import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { $offset } from "../index";
import { execute as filterApplyBlurFilterUseCase } from "../BlurFilter/FilterApplyBlurFilterUseCase";
import { generateFilterGradientLUT } from "../../Gradient/GradientLUTGenerator";
import {
    $generateFilterLUTCacheKey,
    $getCachedFilterLUT,
    $setCachedFilterLUT
} from "../FilterGradientLUTCache";

/**
 * @description 度からラジアンへの変換係数
 */
const DEG_TO_RAD: number = Math.PI / 180;

/**
 * @description グラデーションベベルフィルター処理の設定
 *              Gradient bevel filter processing configuration
 */
interface IGradientBevelConfig {
    device: GPUDevice;
    commandEncoder: GPUCommandEncoder;
    frameBufferManager: {
        createTemporaryAttachment(width: number, height: number): IAttachmentObject;
        releaseTemporaryAttachment(attachment: IAttachmentObject): void;
        createRenderPassDescriptor(
            view: GPUTextureView,
            r: number, g: number, b: number, a: number,
            loadOp: GPULoadOp
        ): GPURenderPassDescriptor;
    };
    pipelineManager: {
        getPipeline(name: string): GPURenderPipeline | undefined;
        getBindGroupLayout(name: string): GPUBindGroupLayout | undefined;
    };
    textureManager: {
        createSampler(name: string, smooth: boolean): GPUSampler;
    };
}

/**
 * @description グラデーションベベルフィルターを適用
 *              Apply gradient bevel filter
 *
 * @param  {IAttachmentObject} sourceAttachment - 入力テクスチャ
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} distance - ベベルの距離
 * @param  {number} angle - ベベルの角度（度）
 * @param  {Float32Array} colors - 色配列
 * @param  {Float32Array} alphas - アルファ配列
 * @param  {Float32Array} ratios - 比率配列
 * @param  {number} blurX - X方向ブラー量
 * @param  {number} blurY - Y方向ブラー量
 * @param  {number} strength - ベベル強度
 * @param  {number} quality - クオリティ
 * @param  {number} type - タイプ (0: full, 1: inner, 2: outer)
 * @param  {boolean} knockout - ノックアウトモード
 * @param  {number} devicePixelRatio - デバイスピクセル比
 * @param  {IGradientBevelConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    sourceAttachment: IAttachmentObject,
    matrix: Float32Array,
    distance: number,
    angle: number,
    colors: Float32Array,
    alphas: Float32Array,
    ratios: Float32Array,
    blurX: number,
    blurY: number,
    strength: number,
    quality: number,
    type: number,
    knockout: boolean,
    devicePixelRatio: number,
    config: IGradientBevelConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 元のオフセットを保存
    const baseOffsetX = $offset.x;
    const baseOffsetY = $offset.y;
    const baseWidth = sourceAttachment.width;
    const baseHeight = sourceAttachment.height;

    // ブラーフィルターを適用
    const blurAttachment = filterApplyBlurFilterUseCase(
        sourceAttachment, matrix,
        blurX, blurY, quality,
        devicePixelRatio, config
    );

    const blurWidth = blurAttachment.width;
    const blurHeight = blurAttachment.height;
    const blurOffsetX = $offset.x;
    const blurOffsetY = $offset.y;

    const offsetDiffX = blurOffsetX - baseOffsetX;
    const offsetDiffY = blurOffsetY - baseOffsetY;

    // 変換行列からスケールを取得
    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    // ベベルのオフセットを計算
    const radian = angle * DEG_TO_RAD;
    const x = Math.cos(radian) * distance * (xScale / devicePixelRatio);
    const y = Math.sin(radian) * distance * (yScale / devicePixelRatio);

    // 出力サイズを計算
    const isInner = type === 1;
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const w = isInner ? baseWidth : blurWidth + Math.max(0, absX - offsetDiffX) * 2;
    const h = isInner ? baseHeight : blurHeight + Math.max(0, absY - offsetDiffY) * 2;
    const width = Math.ceil(w);
    const height = Math.ceil(h);
    const fractionX = (width - w) / 2;
    const fractionY = (height - h) / 2;

    // テクスチャ座標の計算
    const baseTextureX = isInner ? 0 : Math.max(0, offsetDiffX + absX) + fractionX;
    const baseTextureY = isInner ? 0 : Math.max(0, offsetDiffY + absY) + fractionY;
    const blurTextureX = isInner ? 0 : Math.max(0, absX - offsetDiffX) + fractionX;
    const blurTextureY = isInner ? 0 : Math.max(0, absY - offsetDiffY) + fractionY;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    const pipeline = pipelineManager.getPipeline("gradient_bevel_filter");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("gradient_bevel_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU GradientBevelFilter] Pipeline not found");
        frameBufferManager.releaseTemporaryAttachment(blurAttachment);
        return sourceAttachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("gradient_bevel_sampler", true);

    // グラデーションLUTテクスチャを取得（キャッシュから、またはキャッシュに新規追加）
    const lutCacheKey = $generateFilterLUTCacheKey(ratios, colors, alphas);
    let lutTexture = $getCachedFilterLUT(lutCacheKey);

    if (!lutTexture) {
        const lutData = generateFilterGradientLUT(ratios, colors, alphas);
        lutTexture = device.createTexture({
            size: { width: 256, height: 1 },
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        });
        device.queue.writeTexture(
            { texture: lutTexture },
            lutData.buffer,
            { bytesPerRow: 256 * 4, offset: lutData.byteOffset },
            { width: 256, height: 1 }
        );
        $setCachedFilterLUT(lutCacheKey, lutTexture);
    }

    // ユニフォームバッファを作成
    // strength: f32 (4 bytes)
    // inner: f32 (4 bytes)
    // knockout: f32 (4 bytes)
    // bevelType: f32 (4 bytes)
    // offsetX: f32 (4 bytes)
    // offsetY: f32 (4 bytes)
    // padding: f32 x 2 (8 bytes)
    // Total: 32 bytes
    const uniformData = new Float32Array([
        strength,
        isInner ? 1.0 : 0.0,
        knockout ? 1.0 : 0.0,
        type,
        x / width,
        y / height,
        0.0,
        0.0
    ]);

    const uniformBuffer = device.createBuffer({
        size: uniformData.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    // 元テクスチャを適切な位置にコピーした一時テクスチャを作成
    const baseTextureForComposite = frameBufferManager.createTemporaryAttachment(width, height);

    const baseX = Math.round(baseTextureX);
    const baseY = Math.round(baseTextureY);
    if (baseX >= 0 && baseY >= 0 &&
        baseX + baseWidth <= width && baseY + baseHeight <= height) {
        commandEncoder.copyTextureToTexture(
            {
                texture: sourceAttachment.texture,
                origin: { x: 0, y: 0, z: 0 }
            },
            {
                texture: baseTextureForComposite.texture,
                origin: { x: baseX, y: baseY, z: 0 }
            },
            {
                width: baseWidth,
                height: baseHeight
            }
        );
    }

    // ブラーテクスチャを適切な位置にコピーした一時テクスチャを作成
    const blurTextureForComposite = frameBufferManager.createTemporaryAttachment(width, height);

    const blurX2 = Math.round(blurTextureX);
    const blurY2 = Math.round(blurTextureY);
    const srcX = Math.max(0, -blurX2);
    const srcY = Math.max(0, -blurY2);
    const dstX = Math.max(0, blurX2);
    const dstY = Math.max(0, blurY2);
    const copyWidth = Math.min(blurWidth - srcX, width - dstX);
    const copyHeight = Math.min(blurHeight - srcY, height - dstY);

    if (copyWidth > 0 && copyHeight > 0) {
        commandEncoder.copyTextureToTexture(
            {
                texture: blurAttachment.texture,
                origin: { x: srcX, y: srcY, z: 0 }
            },
            {
                texture: blurTextureForComposite.texture,
                origin: { x: dstX, y: dstY, z: 0 }
            },
            {
                width: copyWidth,
                height: copyHeight
            }
        );
    }

    // バインドグループを作成
    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: blurTextureForComposite.textureView },
            { binding: 3, resource: baseTextureForComposite.textureView },
            { binding: 4, resource: lutTexture.createView() }
        ]
    });

    // レンダーパスを実行
    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        destAttachment.textureView, 0, 0, 0, 0, "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    // クリーンアップ（LUTテクスチャはキャッシュで管理されるため破棄しない）
    uniformBuffer.destroy();
    frameBufferManager.releaseTemporaryAttachment(blurAttachment);
    frameBufferManager.releaseTemporaryAttachment(baseTextureForComposite);
    frameBufferManager.releaseTemporaryAttachment(blurTextureForComposite);

    // オフセットを更新
    $offset.x = baseOffsetX + baseTextureX;
    $offset.y = baseOffsetY + baseTextureY;

    return destAttachment;
};
