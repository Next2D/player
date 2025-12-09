import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { $offset } from "../index";
import { execute as filterApplyBlurFilterUseCase } from "../BlurFilter/FilterApplyBlurFilterUseCase";

/**
 * @description 度からラジアンへの変換係数
 */
const DEG_TO_RAD: number = Math.PI / 180;

/**
 * @description ベベルフィルター処理の設定
 *              Bevel filter processing configuration
 */
interface IBevelConfig {
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
 * @description 32bit整数からRGB値を抽出（プリマルチプライドアルファ対応）
 */
const intToRGBA = (color: number, alpha: number): [number, number, number, number] => {
    const r = ((color >> 16) & 0xFF) / 255 * alpha;
    const g = ((color >> 8) & 0xFF) / 255 * alpha;
    const b = (color & 0xFF) / 255 * alpha;
    return [r, g, b, alpha];
};

/**
 * @description ベベルフィルターを適用
 *              Apply bevel filter
 *
 * @param  {IAttachmentObject} sourceAttachment - 入力テクスチャ
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} distance - ベベルの距離
 * @param  {number} angle - ベベルの角度（度）
 * @param  {number} highlightColor - ハイライト色 (32bit整数)
 * @param  {number} highlightAlpha - ハイライトアルファ
 * @param  {number} shadowColor - シャドウ色 (32bit整数)
 * @param  {number} shadowAlpha - シャドウアルファ
 * @param  {number} blurX - X方向ブラー量
 * @param  {number} blurY - Y方向ブラー量
 * @param  {number} strength - ベベル強度
 * @param  {number} quality - クオリティ
 * @param  {number} type - タイプ (0: full, 1: inner, 2: outer)
 * @param  {boolean} knockout - ノックアウトモード
 * @param  {number} devicePixelRatio - デバイスピクセル比
 * @param  {IBevelConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    sourceAttachment: IAttachmentObject,
    matrix: Float32Array,
    distance: number,
    angle: number,
    highlightColor: number,
    highlightAlpha: number,
    shadowColor: number,
    shadowAlpha: number,
    blurX: number,
    blurY: number,
    strength: number,
    quality: number,
    type: number,
    knockout: boolean,
    devicePixelRatio: number,
    config: IBevelConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 元のオフセットを保存
    const baseOffsetX = $offset.x;
    const baseOffsetY = $offset.y;
    const baseWidth = sourceAttachment.width;
    const baseHeight = sourceAttachment.height;

    // 変換行列からスケールを取得
    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    // ベベルのオフセットを計算
    const radian = angle * DEG_TO_RAD;
    const x = Math.cos(radian) * distance * (xScale / devicePixelRatio);
    const y = Math.sin(radian) * distance * (yScale / devicePixelRatio);

    // ベベル用のベーステクスチャを作成
    // 元のテクスチャをコピーし、オフセットした位置でeraseブレンド
    const bevelBaseAttachment = frameBufferManager.createTemporaryAttachment(baseWidth, baseHeight);

    // 元テクスチャをコピー
    commandEncoder.copyTextureToTexture(
        {
            texture: sourceAttachment.texture!.resource,
            origin: { x: 0, y: 0, z: 0 }
        },
        {
            texture: bevelBaseAttachment.texture!.resource,
            origin: { x: 0, y: 0, z: 0 }
        },
        {
            width: baseWidth,
            height: baseHeight
        }
    );

    // ブラーフィルターを適用
    const blurAttachment = filterApplyBlurFilterUseCase(
        bevelBaseAttachment, matrix,
        blurX, blurY, quality,
        devicePixelRatio, config
    );

    const blurWidth = blurAttachment.width;
    const blurHeight = blurAttachment.height;

    // 出力サイズを計算
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const isInner = type === 1;
    const bevelWidth = Math.ceil(blurWidth + absX * 2);
    const bevelHeight = Math.ceil(blurHeight + absY * 2);
    const width = isInner ? baseWidth : bevelWidth;
    const height = isInner ? baseHeight : bevelHeight;

    // テクスチャ座標の計算
    const blurOffsetX = (blurWidth - baseWidth) / 2;
    const blurOffsetY = (blurHeight - baseHeight) / 2;
    const baseTextureX = isInner ? 0 : absX + blurOffsetX;
    const baseTextureY = isInner ? 0 : absY + blurOffsetY;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    const pipeline = pipelineManager.getPipeline("bevel_filter");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("bevel_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU BevelFilter] Pipeline not found");
        frameBufferManager.releaseTemporaryAttachment(blurAttachment);
        frameBufferManager.releaseTemporaryAttachment(bevelBaseAttachment);
        return sourceAttachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("bevel_sampler", true);

    // ユニフォームバッファを作成
    // highlightColor: vec4<f32> (16 bytes)
    // shadowColor: vec4<f32> (16 bytes)
    // strength: f32 (4 bytes)
    // inner: f32 (4 bytes)
    // knockout: f32 (4 bytes)
    // type: f32 (4 bytes)
    // Total: 48 bytes
    const [hr, hg, hb, ha] = intToRGBA(highlightColor, highlightAlpha);
    const [sr, sg, sb, sa] = intToRGBA(shadowColor, shadowAlpha);

    const uniformData = new Float32Array([
        hr, hg, hb, ha,
        sr, sg, sb, sa,
        strength,
        isInner ? 1.0 : 0.0,
        knockout ? 1.0 : 0.0,
        type
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
                texture: sourceAttachment.texture!.resource,
                origin: { x: 0, y: 0, z: 0 }
            },
            {
                texture: baseTextureForComposite.texture!.resource,
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

    const blurTextureX = isInner ? -blurOffsetX - x : absX - x;
    const blurTextureY = isInner ? -blurOffsetY - y : absY - y;
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
                texture: blurAttachment.texture!.resource,
                origin: { x: srcX, y: srcY, z: 0 }
            },
            {
                texture: blurTextureForComposite.texture!.resource,
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
            { binding: 2, resource: blurTextureForComposite.texture!.view },
            { binding: 3, resource: baseTextureForComposite.texture!.view }
        ]
    });

    // レンダーパスを実行
    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        destAttachment.texture!.view, 0, 0, 0, 0, "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    // クリーンアップ
    uniformBuffer.destroy();
    frameBufferManager.releaseTemporaryAttachment(bevelBaseAttachment);
    frameBufferManager.releaseTemporaryAttachment(blurAttachment);
    frameBufferManager.releaseTemporaryAttachment(baseTextureForComposite);
    frameBufferManager.releaseTemporaryAttachment(blurTextureForComposite);

    // オフセットを更新
    if (isInner) {
        $offset.x = baseOffsetX;
        $offset.y = baseOffsetY;
    } else {
        $offset.x = baseOffsetX + baseTextureX;
        $offset.y = baseOffsetY + baseTextureY;
    }

    return destAttachment;
};
