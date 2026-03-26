import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { $offset } from "../FilterOffset";
import { DEG_TO_RAD, intToPremultipliedRGBA } from "../FilterUtil";
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
 * @description ドロップシャドウフィルターを適用
 *              Apply drop shadow filter
 *
 * @param  {IAttachmentObject} source_attachment - 入力テクスチャ
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} distance - シャドウの距離
 * @param  {number} angle - シャドウの角度（度）
 * @param  {number} color - シャドウ色 (32bit整数)
 * @param  {number} alpha - アルファ
 * @param  {number} blur_x - X方向ブラー量
 * @param  {number} blur_y - Y方向ブラー量
 * @param  {number} strength - シャドウ強度
 * @param  {number} quality - クオリティ
 * @param  {boolean} inner - インナーシャドウ
 * @param  {boolean} knockout - ノックアウトモード
 * @param  {boolean} hide_object - 元オブジェクトを隠す
 * @param  {number} device_pixel_ratio - デバイスピクセル比
 * @param  {IFilterConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    source_attachment: IAttachmentObject,
    matrix: Float32Array,
    distance: number,
    angle: number,
    color: number,
    alpha: number,
    blur_x: number,
    blur_y: number,
    strength: number,
    quality: number,
    inner: boolean,
    knockout: boolean,
    hide_object: boolean,
    device_pixel_ratio: number,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 元のオフセットを保存
    const baseOffsetX = $offset.x;
    const baseOffsetY = $offset.y;
    const baseWidth = source_attachment.width;
    const baseHeight = source_attachment.height;

    // ブラーフィルターを適用
    const blurAttachment = filterApplyBlurFilterUseCase(
        source_attachment, matrix,
        blur_x, blur_y, quality,
        device_pixel_ratio, config
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

    // シャドウのオフセットを計算
    const radian = angle * DEG_TO_RAD;
    const shadowX = Math.cos(radian) * distance * (xScale / device_pixel_ratio);
    const shadowY = Math.sin(radian) * distance * (yScale / device_pixel_ratio);

    // 出力キャンバスのサイズを計算
    const w = inner ? baseWidth : blurWidth + Math.max(0, Math.abs(shadowX) - offsetDiffX);
    const h = inner ? baseHeight : blurHeight + Math.max(0, Math.abs(shadowY) - offsetDiffY);
    const width = Math.ceil(w);
    const height = Math.ceil(h);
    const fractionX = (width - w) / 2;
    const fractionY = (height - h) / 2;

    // テクスチャの位置を計算（WebGL版と同じ）
    const baseTextureX = inner ? 0 : Math.max(0, offsetDiffX - shadowX) + fractionX;
    const baseTextureY = inner ? 0 : Math.max(0, offsetDiffY - shadowY) + fractionY;
    const blurTextureX = inner ? shadowX - blurOffsetX : (shadowX > 0 ? Math.max(0, shadowX - offsetDiffX) : 0) + fractionX;
    const blurTextureY = inner ? shadowY - blurOffsetY : (shadowY > 0 ? Math.max(0, shadowY - offsetDiffY) : 0) + fractionY;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    // タイプとノックアウト状態を決定
    const isInner = inner;
    let isKnockout = knockout;
    let isHideObject = hide_object;

    if (inner) {
        isKnockout = knockout || hide_object;
    } else if (!knockout && hide_object) {
        // フルモード（シャドウのみ表示）
        isKnockout = true;
        isHideObject = true;
    }

    const pipeline = pipelineManager.getFilterPipeline("drop_shadow_filter", {
        "IS_INNER": isInner ? 1 : 0,
        "IS_KNOCKOUT": isKnockout ? 1 : 0,
        "IS_HIDE_OBJECT": isHideObject ? 1 : 0
    });
    const bindGroupLayout = pipelineManager.getBindGroupLayout("drop_shadow_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU DropShadowFilter] Pipeline not found");
        frameBufferManager.releaseTemporaryAttachment(blurAttachment);
        return source_attachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("drop_shadow_sampler", true);

    // ユニフォームバッファを作成
    // color: vec4<f32> (16 bytes)
    // baseScale: vec2<f32> (8 bytes)
    // baseOffset: vec2<f32> (8 bytes)
    // blurScale: vec2<f32> (8 bytes)
    // blurOffset: vec2<f32> (8 bytes)
    // strength: f32 (4 bytes)
    // inner: f32 (4 bytes)
    // knockout: f32 (4 bytes)
    // hideObject: f32 (4 bytes)
    // Total: 64 bytes
    const [r, g, b, a] = intToPremultipliedRGBA(color, alpha);

    // WebGL版と同じUV変換方式:
    // uv = texCoord * scale - offset
    // WebGPU: texCoord.y=0がトップ、テクスチャY=0がトップ（Y-flip補正済み）
    // → offset_y = textureY / textureHeight（WebGLのY反転不要）
    const baseScaleX = width / baseWidth;
    const baseScaleY = height / baseHeight;
    const baseOffsetUVX = baseTextureX / baseWidth;
    const baseOffsetUVY = baseTextureY / baseHeight;

    const blurScaleX = width / blurWidth;
    const blurScaleY = height / blurHeight;
    const blurOffsetUVX = blurTextureX / blurWidth;
    const blurOffsetUVY = blurTextureY / blurHeight;

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
    $uniform16[13] = isInner ? 1.0 : 0.0;
    $uniform16[14] = isKnockout ? 1.0 : 0.0;
    $uniform16[15] = isHideObject ? 1.0 : 0.0;

    const uniformBuffer = config.bufferManager
        ? config.bufferManager.acquireAndWriteUniformBuffer($uniform16)
        : device.createBuffer({
            "size": $uniform16.byteLength,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    if (!config.bufferManager) {
        device.queue.writeBuffer(uniformBuffer, 0, $uniform16);
    }

    // バインドグループを作成（オリジナルテクスチャを直接使用）
    ($entries4[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries4[1].resource = sampler;
    $entries4[2].resource = blurAttachment.texture!.view;
    $entries4[3].resource = source_attachment.texture!.view;
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
