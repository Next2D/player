import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { $offset } from "../FilterOffset";
import { execute as filterApplyBlurFilterUseCase } from "../BlurFilter/FilterApplyBlurFilterUseCase";

/**
 * @description プリアロケートされたFloat32Array (サイズ16)
 */
const $uniform16 = new Float32Array(16);

/**
 * @description プリアロケートされたBindGroupEntry配列 (バインディング4つ)
 */
const $entries4: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView },
    { "binding": 3, "resource": null as unknown as GPUTextureView }
];

/**
 * @description 32bit整数からRGB値を抽出（プリマルチプライドアルファ対応）
 */
const intToRGBA = (color: number, alpha: number): [number, number, number, number] => {
    const r = (color >> 16 & 0xFF) / 255 * alpha;
    const g = (color >> 8 & 0xFF) / 255 * alpha;
    const b = (color & 0xFF) / 255 * alpha;
    return [r, g, b, alpha];
};

/**
 * @description グローフィルターを適用
 *              Apply glow filter
 *
 * UV変換方式で元テクスチャとブラーテクスチャを直接サンプリング。
 * copyTextureToTextureと一時テクスチャを使用しない最適化版。
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
 * @param  {IFilterConfig} config - WebGPUリソース設定
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
    config: IFilterConfig
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

    // UV変換パラメータ計算（GradientGlowFilterと同じパターン）
    const baseTextureX = inner ? 0 : offsetDiffX;
    const baseTextureY = inner ? 0 : offsetDiffY;
    const blurTextureX = inner ? -offsetDiffX : 0;
    const blurTextureY = inner ? -offsetDiffY : 0;

    const baseScaleX = width / baseWidth;
    const baseScaleY = height / baseHeight;
    const baseOffsetUVX = baseTextureX / baseWidth;
    const baseOffsetUVY = baseTextureY / baseHeight;

    const blurScaleX = width / blurWidth;
    const blurScaleY = height / blurHeight;
    const blurOffsetUVX = blurTextureX / blurWidth;
    const blurOffsetUVY = blurTextureY / blurHeight;

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
    // baseScale: vec2<f32>, baseOffset: vec2<f32> (16 bytes)
    // blurScale: vec2<f32>, blurOffset: vec2<f32> (16 bytes)
    // strength: f32, inner: f32, knockout: f32, _padding: f32 (16 bytes)
    // Total: 64 bytes
    const [r, g, b, a] = intToRGBA(color, alpha);
    $uniform16[0] = r;
    $uniform16[1] = g;
    $uniform16[2] = b;
    $uniform16[3] = a;
    $uniform16[4] = baseScaleX;
    $uniform16[5] = baseScaleY;
    $uniform16[6] = baseOffsetUVX;
    $uniform16[7] = baseOffsetUVY;
    $uniform16[8] = blurScaleX;
    $uniform16[9] = blurScaleY;
    $uniform16[10] = blurOffsetUVX;
    $uniform16[11] = blurOffsetUVY;
    $uniform16[12] = strength;
    $uniform16[13] = inner ? 1.0 : 0.0;
    $uniform16[14] = knockout ? 1.0 : 0.0;
    $uniform16[15] = 0.0;

    const uniformBuffer = config.bufferManager
        ? config.bufferManager.acquireUniformBuffer($uniform16.byteLength)
        : device.createBuffer({
            "size": $uniform16.byteLength,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    device.queue.writeBuffer(uniformBuffer, 0, $uniform16);

    // バインドグループを作成（元テクスチャとブラーテクスチャを直接バインド）
    ($entries4[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries4[1].resource = sampler;
    $entries4[2].resource = blurAttachment.texture!.view;
    $entries4[3].resource = sourceAttachment.texture!.view;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries4
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
    frameBufferManager.releaseTemporaryAttachment(blurAttachment);

    return destAttachment;
};
