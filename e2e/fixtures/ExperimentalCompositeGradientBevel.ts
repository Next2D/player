import type { IAttachmentObject } from "/packages/webgpu/src/interface/IAttachmentObject";
import type { IFilterConfig } from "/packages/webgpu/src/interface/IFilterConfig";
import { execute as filterAllocateUniformBindingService } from "/packages/webgpu/src/Filter/service/FilterAllocateUniformBindingService";
import { $offset } from "/packages/webgpu/src/Filter/FilterOffset";
import { execute as filterApplyBlurFilterUseCase } from "/packages/webgpu/src/Filter/BlurFilter/FilterApplyBlurFilterUseCase";
import { generateFilterGradientLUT } from "/packages/webgpu/src/Gradient/GradientLUTGenerator";
import {
    $getFilterLUTFromCache,
    $putFilterLUTToCache
} from "/packages/webgpu/src/Filter/FilterGradientLUTCache";
import { getCompositeBindGroup, DEG_TO_RAD } from "./ExperimentalCompositeFilterUtil";

/**
 * @description プリアロケートされたFloat32Array
 */
const $uniform4 = new Float32Array(4);
const $uniform12 = new Float32Array(12);

/**
 * @description プリアロケートされたBindGroupEntry配列 (バインディング3つ)
 */
const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];


/**
 * @description グラデーションベベルフィルターを適用
 *              Apply gradient bevel filter
 *
 *              WebGL版と同じフロー:
 *              1. ベベルベーステクスチャ作成: original * (1 - shifted.a)
 *              2. ベベルベースにブラー適用
 *              3. UV変換方式で最終合成（isInsideでハード境界クリッピング）
 *
 * @param  {IAttachmentObject} source_attachment - 入力テクスチャ
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} distance - ベベルの距離
 * @param  {number} angle - ベベルの角度（度）
 * @param  {Float32Array} colors - 色配列
 * @param  {Float32Array} alphas - アルファ配列
 * @param  {Float32Array} ratios - 比率配列
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
    colors: Float32Array,
    alphas: Float32Array,
    ratios: Float32Array,
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

    // 変換行列からスケールを取得
    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    // ベベルのオフセットを計算
    const radian = angle * DEG_TO_RAD;
    const x = Math.cos(radian) * distance * (xScale / device_pixel_ratio);
    const y = Math.sin(radian) * distance * (yScale / device_pixel_ratio);

    // ===== Step 1: ベベルベーステクスチャ作成 =====
    // WebGL版と同じ: original * (1 - shifted_original.a)
    // shifted = original を (2x, 2y) ピクセル分シフトしたもの
    const bevelBasePipeline = pipelineManager.getPipeline("bevel_base");
    const bevelBaseLayout = pipelineManager.getBindGroupLayout("bevel_base");

    if (!bevelBasePipeline || !bevelBaseLayout) {
        console.error("[WebGPU GradientBevelFilter] bevel_base pipeline not found");
        return source_attachment;
    }

    const bevelBaseAttachment = frameBufferManager.createTemporaryAttachment(baseWidth, baseHeight);
    const bevelBaseSampler = textureManager.createSampler("bevel_base_sampler", true);

    // UV空間でのオフセット: (2x / baseWidth, 2y / baseHeight)
    $uniform4[0] = 2 * x / baseWidth;
    $uniform4[1] = 2 * y / baseHeight;
    $uniform4[2] = 0.0;
    $uniform4[3] = 0.0;

    const bevelBaseUniformBinding = filterAllocateUniformBindingService(
        device, $uniform4, config.bufferManager
    );

    $entries3[0].resource = bevelBaseUniformBinding;
    $entries3[1].resource = bevelBaseSampler;
    $entries3[2].resource = source_attachment.texture!.view;
    const bevelBaseBindGroup = device.createBindGroup({
        "layout": bevelBaseLayout,
        "entries": $entries3
    });

    const bevelBaseRenderPass = frameBufferManager.createRenderPassDescriptor(
        bevelBaseAttachment.texture!.view, 0, 0, 0, 0, "clear"
    );

    const bevelBaseEncoder = commandEncoder.beginRenderPass(bevelBaseRenderPass);
    bevelBaseEncoder.setPipeline(bevelBasePipeline);
    bevelBaseEncoder.setBindGroup(0, bevelBaseBindGroup);
    bevelBaseEncoder.draw(6, 1, 0, 0);
    bevelBaseEncoder.end();

    // ===== Step 2: ベベルベースにブラー適用 =====
    // WebGL版と同じ: bevelBaseをブラーする（元テクスチャではなく）
    const blurAttachment = filterApplyBlurFilterUseCase(
        bevelBaseAttachment, matrix,
        blur_x, blur_y, quality,
        device_pixel_ratio, config
    );

    // ベベルベースは不要になったので解放
    frameBufferManager.releaseTemporaryAttachment(bevelBaseAttachment);

    const blurWidth = blurAttachment.width;
    const blurHeight = blurAttachment.height;

    // ===== Step 3: WebGL版と同じサイズ・位置計算 =====
    const isInner = type === 1;
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const blurOffsetX = (blurWidth - baseWidth) / 2;
    const blurOffsetY = (blurHeight - baseHeight) / 2;

    // WebGL版と同じ: bevelWidth/bevelHeight
    const bevelWidth = Math.ceil(blurWidth + absX * 2);
    const bevelHeight = Math.ceil(blurHeight + absY * 2);

    const width = isInner ? baseWidth : bevelWidth;
    const height = isInner ? baseHeight : bevelHeight;

    // WebGL版と同じテクスチャ位置計算
    const baseTextureX = isInner ? 0 : absX + blurOffsetX;
    const baseTextureY = isInner ? 0 : absY + blurOffsetY;
    const blurTextureX = isInner ? -blurOffsetX - x : absX - x;
    const blurTextureY = isInner ? -blurOffsetY - y : absY - y;

    // ===== Step 4: グラデーションLUT生成 =====
    // 注意: 共有テクスチャ+queue.writeTextureは使用しない。
    // queue.writeTextureはcommandEncoder外で即座に実行されるため、
    // 同一フレーム内の複数GradientBevelFilter適用時に最後の書き込みで上書きされる。
    // 各呼び出しで専用テクスチャを作成してこのタイミング問題を回避する。
    // stopsキーのキャッシュを参照し、同一グラデーションのLUT再生成を回避する
    // (キー毎に専用テクスチャのため、同一フレーム内の複数フィルター適用でも上書きされない)
    let lutEntry = $getFilterLUTFromCache(ratios, colors, alphas);
    if (!lutEntry) {
        const lutData = generateFilterGradientLUT(ratios, colors, alphas);
        const lutTexture = device.createTexture({
            "size": { "width": 256, "height": 1 },
            "format": "rgba8unorm",
            "usage": GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        });
        device.queue.writeTexture(
            { "texture": lutTexture },
            lutData.buffer,
            { "bytesPerRow": 256 * 4, "offset": lutData.byteOffset },
            { "width": 256, "height": 1 }
        );
        lutEntry = $putFilterLUTToCache(
            ratios, colors, alphas, lutTexture, lutTexture.createView()
        );
    }
    const lutView = lutEntry.view;

    // ===== Step 5: UV変換パラメータ計算 =====
    // WebGL版と同じ: uv = v_coord * scale - offset
    // WebGPU: texCoord.y=0がトップ（Y-flip補正済み）
    //         → offset_y = textureY / textureHeight（WebGLのY反転不要）
    const baseScaleX = width / baseWidth;
    const baseScaleY = height / baseHeight;
    const baseOffsetUVX = baseTextureX / baseWidth;
    const baseOffsetUVY = baseTextureY / baseHeight;

    const blurScaleX = width / blurWidth;
    const blurScaleY = height / blurHeight;
    const blurOffsetUVX = blurTextureX / blurWidth;
    const blurOffsetUVY = blurTextureY / blurHeight;

    // ===== Step 6: 最終合成パス =====
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    const pipeline = pipelineManager.getFilterPipeline("gradient_bevel_filter", {
        "BEVEL_TYPE": type,
        "IS_KNOCKOUT": knockout ? 1 : 0
    });
    const bindGroupLayout = pipelineManager.getBindGroupLayout("gradient_bevel_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU GradientBevelFilter] Pipeline not found");
        frameBufferManager.releaseTemporaryAttachment(blurAttachment);
        return source_attachment;
    }

    const sampler = textureManager.createSampler("gradient_bevel_sampler", true);

    // ユニフォームバッファ: 12 floats = 48 bytes
    $uniform12[0] = strength;
    $uniform12[1] = isInner ? 1.0 : 0.0;
    $uniform12[2] = knockout ? 1.0 : 0.0;
    $uniform12[3] = type;
    $uniform12[4] = baseScaleX;
    $uniform12[5] = baseScaleY;
    $uniform12[6] = baseOffsetUVX;
    $uniform12[7] = baseOffsetUVY;
    $uniform12[8] = blurScaleX;
    $uniform12[9] = blurScaleY;
    $uniform12[10] = blurOffsetUVX;
    $uniform12[11] = blurOffsetUVY;

    const uniformBinding = filterAllocateUniformBindingService(
        device, $uniform12, config.bufferManager
    );

    // バインドグループを作成（オリジナルテクスチャを直接使用）
    const bindGroup = getCompositeBindGroup(
        device, bindGroupLayout, uniformBinding, sampler,
        blurAttachment.texture!.view, source_attachment.texture!.view, lutView, !!config.bufferManager
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

    frameBufferManager.releaseTemporaryAttachment(blurAttachment);

    // WebGL版と同じオフセット更新
    $offset.x = baseOffsetX + baseTextureX;
    $offset.y = baseOffsetY + baseTextureY;

    return destAttachment;
};
