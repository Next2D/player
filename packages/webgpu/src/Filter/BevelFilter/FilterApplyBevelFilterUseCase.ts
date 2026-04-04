import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { $offset } from "../FilterOffset";
import { DEG_TO_RAD, intToPremultipliedRGBA } from "../FilterUtil";
import { execute as filterApplyBlurFilterUseCase } from "../BlurFilter/FilterApplyBlurFilterUseCase";

/**
 * @description プリアロケートされたFloat32Array
 */
const $uniform8 = new Float32Array(8);
const $uniform20 = new Float32Array(20);

/**
 * @description プリアロケートされたBindGroupEntry配列 (バインディング3つ)
 */
const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];

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
 * @description ベベルフィルターを適用
 *              Apply bevel filter
 *
 *              WebGL版と同様に、erase前処理で差分テクスチャを作成してからブラーを適用
 *              UV変換方式で元テクスチャとブラーテクスチャを直接サンプリング。
 *              合成時のcopyTextureToTextureと一時テクスチャを使用しない最適化版。
 *
 * @param  {IAttachmentObject} source_attachment - 入力テクスチャ
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} distance - ベベルの距離
 * @param  {number} angle - ベベルの角度（度）
 * @param  {number} highlight_color - ハイライト色 (32bit整数)
 * @param  {number} highlight_alpha - ハイライトアルファ
 * @param  {number} shadow_color - シャドウ色 (32bit整数)
 * @param  {number} shadow_alpha - シャドウアルファ
 * @param  {number} blur_x - X方向ブラー量
 * @param  {number} blur_y - Y方向ブラー量
 * @param  {number} strength - ベベル強度
 * @param  {number} quality - クオリティ
 * @param  {number} type - タイプ (0: full, 1: inner, 2: outer)
 * @param  {boolean} knockout - ノックアウトモード
 * @param  {number} device_pixel_ratio - デバイスピクセル比
 * @param  {IFilterConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    source_attachment: IAttachmentObject,
    matrix: Float32Array,
    distance: number,
    angle: number,
    highlight_color: number,
    highlight_alpha: number,
    shadow_color: number,
    shadow_alpha: number,
    blur_x: number,
    blur_y: number,
    strength: number,
    quality: number,
    type: number,
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

    // スケールを計算
    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    // オフセットを計算（WebGL版と同じ）
    const radian = angle * DEG_TO_RAD;
    const x = Math.cos(radian) * distance * (xScale / device_pixel_ratio);
    const y = Math.sin(radian) * distance * (yScale / device_pixel_ratio);

    // === Erase前処理：差分テクスチャを作成 ===
    const eraseAttachment = frameBufferManager.createTemporaryAttachment(baseWidth, baseHeight);

    // Step 1: ソーステクスチャを元の位置にコピー（erase前処理のcopyTextureToTextureは残す）
    commandEncoder.copyTextureToTexture(
        {
            "texture": source_attachment.texture!.resource,
            "origin": { "x": 0, "y": 0, "z": 0 }
        },
        {
            "texture": eraseAttachment.texture!.resource,
            "origin": { "x": 0, "y": 0, "z": 0 }
        },
        {
            "width": baseWidth,
            "height": baseHeight
        }
    );

    // Step 2: オフセット位置からサンプルしてerase描画
    const erasePipeline = pipelineManager.getPipeline("texture_erase");
    const eraseBindGroupLayout = pipelineManager.getBindGroupLayout("texture_copy");

    if (erasePipeline && eraseBindGroupLayout) {
        const eraseSampler = textureManager.createSampler("erase_sampler", true);

        const offsetX = x * 2 / baseWidth;
        const offsetY = y * 2 / baseHeight;

        $uniform8[0] = 1.0;
        $uniform8[1] = 1.0;
        $uniform8[2] = offsetX;
        $uniform8[3] = offsetY;
        $uniform8[4] = 0;
        $uniform8[5] = 0;
        $uniform8[6] = 0;
        $uniform8[7] = 0;

        const eraseUniformBuffer = config.bufferManager
            ? config.bufferManager.acquireAndWriteUniformBuffer($uniform8)
            : device.createBuffer({
                "size": $uniform8.byteLength,
                "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        if (!config.bufferManager) {
            device.queue.writeBuffer(eraseUniformBuffer, 0, $uniform8);
        }

        ($entries3[0].resource as GPUBufferBinding).buffer = eraseUniformBuffer;
        $entries3[1].resource = eraseSampler;
        $entries3[2].resource = source_attachment.texture!.view;
        const eraseBindGroup = device.createBindGroup({
            "layout": eraseBindGroupLayout,
            "entries": $entries3
        });

        const erasePassDescriptor = frameBufferManager.createRenderPassDescriptor(
            eraseAttachment.texture!.view, 0, 0, 0, 0, "load"
        );

        const erasePassEncoder = commandEncoder.beginRenderPass(erasePassDescriptor);
        erasePassEncoder.setPipeline(erasePipeline);
        erasePassEncoder.setBindGroup(0, eraseBindGroup);
        erasePassEncoder.draw(6, 1, 0, 0);
        erasePassEncoder.end();
    }

    // === 差分テクスチャにブラーを適用 ===
    const blurAttachment = filterApplyBlurFilterUseCase(
        eraseAttachment, matrix,
        blur_x, blur_y, quality,
        device_pixel_ratio, config
    );

    // eraseアタッチメントを解放
    frameBufferManager.releaseTemporaryAttachment(eraseAttachment);

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

    // オフセット差分を計算
    const blurOffsetFromBase = (blurWidth - baseWidth) / 2;
    const blurOffsetFromBaseY = (blurHeight - baseHeight) / 2;

    // UV変換パラメータ計算（GradientBevelFilterと同じパターン）
    const baseTextureX = isInner ? 0 : Math.floor(absX + blurOffsetFromBase);
    const baseTextureY = isInner ? 0 : Math.floor(absY + blurOffsetFromBaseY);
    const blurTextureX = isInner ? Math.floor(-blurOffsetFromBase - x) : Math.floor(absX - x);
    const blurTextureY = isInner ? Math.floor(-blurOffsetFromBaseY - y) : Math.floor(absY - y);

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

    const pipeline = pipelineManager.getFilterPipeline("bevel_filter", {
        "BEVEL_TYPE": type,
        "IS_KNOCKOUT": knockout ? 1 : 0
    });
    const bindGroupLayout = pipelineManager.getBindGroupLayout("bevel_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU BevelFilter] Pipeline not found");
        frameBufferManager.releaseTemporaryAttachment(blurAttachment);
        return source_attachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("bevel_sampler", true);

    // ユニフォームバッファを作成
    // highlightColor: vec4<f32> (16 bytes)
    // shadowColor: vec4<f32> (16 bytes)
    // strength, inner, knockout, bevelType (16 bytes)
    // baseScale, baseOffset (16 bytes)
    // blurScale, blurOffset (16 bytes)
    // Total: 80 bytes → 16 floats + 4 floats = 20 floats (80 bytes)
    const [hr, hg, hb, ha] = intToPremultipliedRGBA(highlight_color, highlight_alpha);
    const [sr, sg, sb, sa] = intToPremultipliedRGBA(shadow_color, shadow_alpha);

    $uniform20[0] = hr;
    $uniform20[1] = hg;
    $uniform20[2] = hb;
    $uniform20[3] = ha;
    $uniform20[4] = sr;
    $uniform20[5] = sg;
    $uniform20[6] = sb;
    $uniform20[7] = sa;
    $uniform20[8] = strength;
    $uniform20[9] = isInner ? 1.0 : 0.0;
    $uniform20[10] = knockout ? 1.0 : 0.0;
    $uniform20[11] = type;
    $uniform20[12] = baseScaleX;
    $uniform20[13] = baseScaleY;
    $uniform20[14] = baseOffsetUVX;
    $uniform20[15] = baseOffsetUVY;
    $uniform20[16] = blurScaleX;
    $uniform20[17] = blurScaleY;
    $uniform20[18] = blurOffsetUVX;
    $uniform20[19] = blurOffsetUVY;

    const uniformBuffer = config.bufferManager
        ? config.bufferManager.acquireAndWriteUniformBuffer($uniform20)
        : device.createBuffer({
            "size": $uniform20.byteLength,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    if (!config.bufferManager) {
        device.queue.writeBuffer(uniformBuffer, 0, $uniform20);
    }

    // バインドグループを作成（元テクスチャとブラーテクスチャを直接バインド）
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

    // オフセットを更新（WebGL版と同じ: 常にbaseOffset+baseTextureXYに設定）
    $offset.x = baseOffsetX + baseTextureX;
    $offset.y = baseOffsetY + baseTextureY;

    return destAttachment;
};
