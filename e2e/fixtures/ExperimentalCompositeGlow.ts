import type { IAttachmentObject } from "/packages/webgpu/src/interface/IAttachmentObject";
import type { IFilterConfig } from "/packages/webgpu/src/interface/IFilterConfig";
import { $offset } from "/packages/webgpu/src/Filter/FilterOffset";
import { getCompositeBindGroup, intToPremultipliedRGBA } from "./ExperimentalCompositeFilterUtil";
import { execute as filterApplyBlurFilterUseCase } from "/packages/webgpu/src/Filter/BlurFilter/FilterApplyBlurFilterUseCase";

/**
 * @description プリアロケートされたFloat32Array (サイズ16)
 */
const $uniform16 = new Float32Array(16);


/**
 * @description グローフィルターを適用
 *              Apply glow filter
 *
 * UV変換方式で元テクスチャとブラーテクスチャを直接サンプリング。
 * copyTextureToTextureと一時テクスチャを使用しない最適化版。
 *
 * @param  {IAttachmentObject} source_attachment - 入力テクスチャ
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} color - グロー色 (32bit整数)
 * @param  {number} alpha - アルファ
 * @param  {number} blur_x - X方向ブラー量
 * @param  {number} blur_y - Y方向ブラー量
 * @param  {number} strength - グロー強度
 * @param  {number} quality - クオリティ
 * @param  {boolean} inner - インナーグロー
 * @param  {boolean} knockout - ノックアウトモード
 * @param  {number} device_pixel_ratio - デバイスピクセル比
 * @param  {IFilterConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    source_attachment: IAttachmentObject,
    matrix: Float32Array,
    color: number,
    alpha: number,
    blur_x: number,
    blur_y: number,
    strength: number,
    quality: number,
    inner: boolean,
    knockout: boolean,
    device_pixel_ratio: number,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 元のオフセットを保存
    const baseOffsetX = $offset.x;
    const baseOffsetY = $offset.y;
    const baseWidth = source_attachment.width;
    const baseHeight = source_attachment.height;

    const blurAttachment = filterApplyBlurFilterUseCase(
        source_attachment, matrix,
        blur_x, blur_y, quality,
        device_pixel_ratio, config
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

    const pipeline = pipelineManager.getFilterPipeline("glow_filter", {
        "IS_INNER": inner ? 1 : 0,
        "IS_KNOCKOUT": knockout ? 1 : 0
    });
    const bindGroupLayout = pipelineManager.getBindGroupLayout("glow_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU GlowFilter] Pipeline not found");
        frameBufferManager.releaseTemporaryAttachment(blurAttachment);
        return source_attachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("glow_sampler", true);

    // ユニフォームバッファを作成
    // color: vec4<f32> (16 bytes)
    // baseScale: vec2<f32>, baseOffset: vec2<f32> (16 bytes)
    // blurScale: vec2<f32>, blurOffset: vec2<f32> (16 bytes)
    // strength: f32, inner: f32, knockout: f32, _padding: f32 (16 bytes)
    // Total: 64 bytes
    const [r, g, b, a] = intToPremultipliedRGBA(color, alpha);
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

    let uniformBinding: GPUBufferBinding;
    if (config.bufferManager) {
        uniformBinding = config.bufferManager.allocateUniformBinding($uniform16);
    } else {
        const uniformBuffer = device.createBuffer({
            "size": $uniform16.byteLength,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(uniformBuffer, 0, $uniform16);
        uniformBinding = { "buffer": uniformBuffer, "offset": 0, "size": $uniform16.byteLength };
    }

    // バインドグループを作成（元テクスチャとブラーテクスチャを直接バインド）
    const bindGroup = getCompositeBindGroup(
        device, bindGroupLayout, uniformBinding, sampler,
        blurAttachment.texture!.view, source_attachment.texture!.view, null, !!config.bufferManager
    );

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
