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
 * @description グラデーションベベルフィルターを適用
 *              Apply gradient bevel filter
 *
 *              WebGL版と同じフロー:
 *              1. ベベルベーステクスチャ作成: original * (1 - shifted.a)
 *              2. ベベルベースにブラー適用
 *              3. UV変換方式で最終合成（isInsideでハード境界クリッピング）
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
    config: IFilterConfig
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

    // ===== Step 1: ベベルベーステクスチャ作成 =====
    // WebGL版と同じ: original * (1 - shifted_original.a)
    // shifted = original を (2x, 2y) ピクセル分シフトしたもの
    const bevelBasePipeline = pipelineManager.getPipeline("bevel_base");
    const bevelBaseLayout = pipelineManager.getBindGroupLayout("bevel_base");

    if (!bevelBasePipeline || !bevelBaseLayout) {
        console.error("[WebGPU GradientBevelFilter] bevel_base pipeline not found");
        return sourceAttachment;
    }

    const bevelBaseAttachment = frameBufferManager.createTemporaryAttachment(baseWidth, baseHeight);
    const bevelBaseSampler = textureManager.createSampler("bevel_base_sampler", true);

    // UV空間でのオフセット: (2x / baseWidth, 2y / baseHeight)
    const bevelBaseUniformData = new Float32Array([
        2 * x / baseWidth,
        2 * y / baseHeight,
        0.0,
        0.0
    ]);

    const bevelBaseUniformBuffer = device.createBuffer({
        "size": bevelBaseUniformData.byteLength,
        "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(bevelBaseUniformBuffer, 0, bevelBaseUniformData);

    const bevelBaseBindGroup = device.createBindGroup({
        "layout": bevelBaseLayout,
        "entries": [
            { "binding": 0, "resource": { "buffer": bevelBaseUniformBuffer } },
            { "binding": 1, "resource": bevelBaseSampler },
            { "binding": 2, "resource": sourceAttachment.texture!.view }
        ]
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
        blurX, blurY, quality,
        devicePixelRatio, config
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

    const pipeline = pipelineManager.getPipeline("gradient_bevel_filter");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("gradient_bevel_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU GradientBevelFilter] Pipeline not found");
        frameBufferManager.releaseTemporaryAttachment(blurAttachment);
        return sourceAttachment;
    }

    const sampler = textureManager.createSampler("gradient_bevel_sampler", true);

    // ユニフォームバッファ: 12 floats = 48 bytes
    const uniformData = new Float32Array([
        strength,
        isInner ? 1.0 : 0.0,
        knockout ? 1.0 : 0.0,
        type,
        baseScaleX, baseScaleY,
        baseOffsetUVX, baseOffsetUVY,
        blurScaleX, blurScaleY,
        blurOffsetUVX, blurOffsetUVY
    ]);

    const uniformBuffer = device.createBuffer({
        "size": uniformData.byteLength,
        "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    // バインドグループを作成（オリジナルテクスチャを直接使用）
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [
            { "binding": 0, "resource": { "buffer": uniformBuffer } },
            { "binding": 1, "resource": sampler },
            { "binding": 2, "resource": blurAttachment.texture!.view },
            { "binding": 3, "resource": sourceAttachment.texture!.view },
            { "binding": 4, "resource": lutView }
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

    // クリーンアップ（LUTは共有テクスチャなので破棄しない）
    frameBufferManager.releaseTemporaryAttachment(blurAttachment);

    // WebGL版と同じオフセット更新
    $offset.x = baseOffsetX + baseTextureX;
    $offset.y = baseOffsetY + baseTextureY;

    return destAttachment;
};
