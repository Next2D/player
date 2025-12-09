import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { $offset } from "../index";
import { execute as filterApplyBlurFilterUseCase } from "../BlurFilter/FilterApplyBlurFilterUseCase";

/**
 * @description グローフィルター処理の設定
 *              Glow filter processing configuration
 */
interface IGlowConfig {
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
 * @description グローフィルターを適用
 *              Apply glow filter
 *
 * @param  {IAttachmentObject} sourceAttachment - 入力テクスチャ
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} color - グロー色 (32bit整数)
 * @param  {number} alpha - アルファ
 * @param  {number} blurX - X方向ブラー量
 * @param  {number} blurY - Y方向ブラー量
 * @param  {number} strength - グロー強度
 * @param  {number} quality - クオリティ
 * @param  {boolean} inner - インナーグロー
 * @param  {boolean} knockout - ノックアウトモード
 * @param  {number} devicePixelRatio - デバイスピクセル比
 * @param  {IGlowConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    sourceAttachment: IAttachmentObject,
    matrix: Float32Array,
    color: number,
    alpha: number,
    blurX: number,
    blurY: number,
    strength: number,
    quality: number,
    inner: boolean,
    knockout: boolean,
    devicePixelRatio: number,
    config: IGlowConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 元のオフセットを保存
    const baseOffsetX = $offset.x;
    const baseOffsetY = $offset.y;
    const baseWidth = sourceAttachment.width;
    const baseHeight = sourceAttachment.height;

    // ブラーフィルターを適用（元テクスチャを保持）
    const blurAttachment = filterApplyBlurFilterUseCase(
        sourceAttachment, matrix,
        blurX, blurY, quality,
        devicePixelRatio, config
    );

    const blurWidth = blurAttachment.width;
    const blurHeight = blurAttachment.height;
    const blurOffsetX = $offset.x;
    const blurOffsetY = $offset.y;

    // 出力サイズを決定
    const width = inner ? baseWidth : blurWidth;
    const height = inner ? baseHeight : blurHeight;

    // オフセット差分を計算
    const offsetDiffX = blurOffsetX - baseOffsetX;
    const offsetDiffY = blurOffsetY - baseOffsetY;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    const pipeline = pipelineManager.getPipeline("glow_filter");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("glow_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU GlowFilter] Pipeline not found");
        frameBufferManager.releaseTemporaryAttachment(blurAttachment);
        return sourceAttachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("glow_sampler", true);

    // ユニフォームバッファを作成
    // color: vec4<f32> (16 bytes)
    // strength: f32 (4 bytes)
    // inner: f32 (4 bytes)
    // knockout: f32 (4 bytes)
    // _padding: f32 (4 bytes)
    // Total: 32 bytes
    const [r, g, b, a] = intToRGBA(color, alpha);
    const uniformData = new Float32Array([
        r, g, b, a,
        strength,
        inner ? 1.0 : 0.0,
        knockout ? 1.0 : 0.0,
        0.0 // padding
    ]);

    const uniformBuffer = device.createBuffer({
        size: uniformData.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    // 元テクスチャを適切な位置にコピーした一時テクスチャを作成
    const baseTextureForComposite = frameBufferManager.createTemporaryAttachment(width, height);

    // 元テクスチャをコピー（オフセット付き）
    const baseTextureX = inner ? 0 : offsetDiffX;
    const baseTextureY = inner ? 0 : offsetDiffY;

    if (baseTextureX >= 0 && baseTextureY >= 0 &&
        baseTextureX + baseWidth <= width && baseTextureY + baseHeight <= height) {
        commandEncoder.copyTextureToTexture(
            {
                texture: sourceAttachment.texture!.resource,
                origin: { x: 0, y: 0, z: 0 }
            },
            {
                texture: baseTextureForComposite.texture!.resource,
                origin: { x: baseTextureX, y: baseTextureY, z: 0 }
            },
            {
                width: baseWidth,
                height: baseHeight
            }
        );
    }

    // ブラーテクスチャを適切な位置にコピーした一時テクスチャを作成
    const blurTextureForComposite = frameBufferManager.createTemporaryAttachment(width, height);

    const blurTextureX = inner ? -offsetDiffX : 0;
    const blurTextureY = inner ? -offsetDiffY : 0;

    // ブラーテクスチャをコピー
    const srcX = Math.max(0, -blurTextureX);
    const srcY = Math.max(0, -blurTextureY);
    const dstX = Math.max(0, blurTextureX);
    const dstY = Math.max(0, blurTextureY);
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
    frameBufferManager.releaseTemporaryAttachment(blurAttachment);
    frameBufferManager.releaseTemporaryAttachment(baseTextureForComposite);
    frameBufferManager.releaseTemporaryAttachment(blurTextureForComposite);

    // オフセットを更新（インナーの場合は元のオフセットを維持）
    if (inner) {
        $offset.x = baseOffsetX;
        $offset.y = baseOffsetY;
    }

    return destAttachment;
};
