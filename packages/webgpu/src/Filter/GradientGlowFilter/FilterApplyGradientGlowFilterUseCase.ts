import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { $offset } from "../FilterOffset";
import { execute as filterApplyBlurFilterUseCase } from "../BlurFilter/FilterApplyBlurFilterUseCase";
import { generateFilterGradientLUT } from "../../Gradient/GradientLUTGenerator";

/**
 * @description 度からラジアンへの変換係数
 */
const DEG_TO_RAD: number = Math.PI / 180;

/**
 * @description プリアロケートされたFloat32Array (サイズ12)
 */
const $uniform12 = new Float32Array(12);

/**
 * @description プリアロケートされたBindGroupEntry配列 (バインディング5つ)
 */
const $entries5: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView },
    { "binding": 3, "resource": null as unknown as GPUTextureView },
    { "binding": 4, "resource": null as unknown as GPUTextureView }
];

/**
 * @description グラデーショングローフィルターを適用
 *              Apply gradient glow filter
 *
 *              WebGL版と同じフロー:
 *              1. ブラー適用
 *              2. グラデーションLUT生成（専用テクスチャ）
 *              3. UV変換方式で最終合成（isInsideでハード境界クリッピング）
 *
 * @param  {IAttachmentObject} sourceAttachment - 入力テクスチャ
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} distance - グローの距離
 * @param  {number} angle - グローの角度（度）
 * @param  {Float32Array} colors - 色配列
 * @param  {Float32Array} alphas - アルファ配列
 * @param  {Float32Array} ratios - 比率配列
 * @param  {number} blurX - X方向ブラー量
 * @param  {number} blurY - Y方向ブラー量
 * @param  {number} strength - グロー強度
 * @param  {number} quality - クオリティ
 * @param  {number} type - タイプ (0: full, 1: inner, 2: outer)
 * @param  {boolean} knockout - ノックアウトモード
 * @param  {number} devicePixelRatio - デバイスピクセル比
 * @param  {IFilterConfig} config - WebGPUリソース設定
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
    config: IFilterConfig
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

    // グローのオフセットを計算
    const radian = angle * DEG_TO_RAD;
    const x = Math.cos(radian) * distance * (xScale / devicePixelRatio);
    const y = Math.sin(radian) * distance * (yScale / devicePixelRatio);

    // ===== WebGL版と同じサイズ・位置計算 =====
    const isInner = type === 1;
    const w = isInner ? baseWidth : blurWidth + Math.max(0, Math.abs(x) - offsetDiffX);
    const h = isInner ? baseHeight : blurHeight + Math.max(0, Math.abs(y) - offsetDiffY);
    const width = Math.ceil(w);
    const height = Math.ceil(h);
    const fractionX = (width - w) / 2;
    const fractionY = (height - h) / 2;

    // テクスチャ座標の計算
    const baseTextureX = isInner ? 0 : Math.max(0, offsetDiffX - x) + fractionX;
    const baseTextureY = isInner ? 0 : Math.max(0, offsetDiffY - y) + fractionY;
    const blurTextureX = isInner ? x - blurOffsetX : (x > 0 ? Math.max(0, x - offsetDiffX) : 0) + fractionX;
    const blurTextureY = isInner ? y - blurOffsetY : (y > 0 ? Math.max(0, y - offsetDiffY) : 0) + fractionY;

    // ===== グラデーションLUT生成（専用テクスチャ） =====
    // 注意: 共有テクスチャは使用しない。
    // queue.writeTextureはcommandEncoder外で即座に実行されるため、
    // 同一フレーム内の複数GradientGlowFilter適用時に最後の書き込みで上書きされる。
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
    const lutView = lutTexture.createView();

    // ===== UV変換パラメータ計算 =====
    // WebGPU: texCoord.y=0がトップ（Y-flip補正済み）
    const baseScaleX = width / baseWidth;
    const baseScaleY = height / baseHeight;
    const baseOffsetUVX = baseTextureX / baseWidth;
    const baseOffsetUVY = baseTextureY / baseHeight;

    const blurScaleX = width / blurWidth;
    const blurScaleY = height / blurHeight;
    const blurOffsetUVX = blurTextureX / blurWidth;
    const blurOffsetUVY = blurTextureY / blurHeight;

    // ===== 最終合成パス =====
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    const pipeline = pipelineManager.getFilterPipeline("gradient_glow_filter", {
        "GLOW_TYPE": type,
        "IS_KNOCKOUT": knockout ? 1 : 0
    });
    const bindGroupLayout = pipelineManager.getBindGroupLayout("gradient_glow_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU GradientGlowFilter] Pipeline not found");
        frameBufferManager.releaseTemporaryAttachment(blurAttachment);
        return sourceAttachment;
    }

    const sampler = textureManager.createSampler("gradient_glow_sampler", true);

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

    const uniformBuffer = config.bufferManager
        ? config.bufferManager.acquireAndWriteUniformBuffer($uniform12)
        : device.createBuffer({
            "size": $uniform12.byteLength,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    if (!config.bufferManager) {
        device.queue.writeBuffer(uniformBuffer, 0, $uniform12);
    }

    // バインドグループを作成（オリジナルテクスチャを直接使用）
    ($entries5[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries5[1].resource = sampler;
    $entries5[2].resource = blurAttachment.texture!.view;
    $entries5[3].resource = sourceAttachment.texture!.view;
    $entries5[4].resource = lutView;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries5
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

    // クリーンアップ（lutTextureはsubmit後に遅延破棄）
    config.frameTextures.push(lutTexture);
    frameBufferManager.releaseTemporaryAttachment(blurAttachment);

    // WebGL版と同じオフセット更新
    $offset.x = baseOffsetX + baseTextureX;
    $offset.y = baseOffsetY + baseTextureY;

    return destAttachment;
};
