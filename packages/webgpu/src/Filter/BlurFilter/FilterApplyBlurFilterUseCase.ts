import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { $offset } from "../FilterOffset";
import { calculateBlurParams, calculateDirectionalBlurParams } from "../BlurFilterUseCase";

/**
 * @description プリアロケートされたFloat32Array (サイズ4)
 */
const $uniform4 = new Float32Array(4);

/**
 * @description プリアロケートされたBindGroupEntry配列 (バインディング3つ)
 */
const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];

/**
 * @description ブラーフィルターを適用
 *              Apply blur filter
 *
 * @param  {IAttachmentObject} sourceAttachment - 入力テクスチャ（アタッチメント）
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} blurX - X方向のブラー量
 * @param  {number} blurY - Y方向のブラー量
 * @param  {number} quality - クオリティ (1-15)
 * @param  {number} devicePixelRatio - デバイスピクセル比
 * @param  {IFilterConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    sourceAttachment: IAttachmentObject,
    matrix: Float32Array,
    blurX: number,
    blurY: number,
    quality: number,
    devicePixelRatio: number,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // ブラーパラメータを計算
    const blurParams = calculateBlurParams(matrix, blurX, blurY, quality, devicePixelRatio);
    const { baseBlurX, baseBlurY, offsetX, offsetY, bufferScaleX, bufferScaleY } = blurParams;

    // オフセットを更新
    $offset.x += offsetX;
    $offset.y += offsetY;

    // ブラー用バッファサイズを計算
    const width = sourceAttachment.width + offsetX * 2;
    const height = sourceAttachment.height + offsetY * 2;
    const bufferWidth = Math.ceil(width * bufferScaleX);
    const bufferHeight = Math.ceil(height * bufferScaleY);

    // ピンポンバッファ用の一時アタッチメントを作成
    const attachment0 = frameBufferManager.createTemporaryAttachment(bufferWidth, bufferHeight);
    const attachment1 = frameBufferManager.createTemporaryAttachment(bufferWidth, bufferHeight);

    // サンプラーを作成（線形補間）
    const sampler = textureManager.createSampler("blur_sampler", true);

    // ソーステクスチャをattachment0にコピー（スケーリング付き）
    copyTextureToAttachment(
        device, commandEncoder, frameBufferManager, pipelineManager,
        sourceAttachment, attachment0, sampler,
        bufferScaleX, bufferScaleY,
        offsetX * bufferScaleX, offsetY * bufferScaleY,
        config.bufferManager
    );

    // バッファスケールを考慮したブラー値
    const bufferBlurX = baseBlurX * bufferScaleX;
    const bufferBlurY = baseBlurY * bufferScaleY;

    // ブラーパスを実行
    const attachments = [attachment0, attachment1];
    let attachmentIndex = 0;

    for (let q = 0; q < quality; ++q) {
        // 水平ブラー
        if (blurX > 0) {
            const srcIndex = attachmentIndex;
            attachmentIndex = (attachmentIndex + 1) % 2;

            applyDirectionalBlur(
                device, commandEncoder, frameBufferManager, pipelineManager,
                attachments[srcIndex], attachments[attachmentIndex], sampler,
                true, bufferBlurX, config.bufferManager
            );
        }

        // 垂直ブラー
        if (blurY > 0) {
            const srcIndex = attachmentIndex;
            attachmentIndex = (attachmentIndex + 1) % 2;

            applyDirectionalBlur(
                device, commandEncoder, frameBufferManager, pipelineManager,
                attachments[srcIndex], attachments[attachmentIndex], sampler,
                false, bufferBlurY, config.bufferManager
            );
        }
    }

    // 結果のアタッチメント
    let resultAttachment = attachments[attachmentIndex];

    // バッファスケールが1でない場合は元のサイズにアップスケール
    if (bufferScaleX !== 1 || bufferScaleY !== 1) {
        const finalAttachment = frameBufferManager.createTemporaryAttachment(width, height);

        upscaleTexture(
            device, commandEncoder, frameBufferManager, pipelineManager,
            resultAttachment, finalAttachment, sampler,
            config.bufferManager
        );

        // ピンポンバッファを解放
        frameBufferManager.releaseTemporaryAttachment(attachment0);
        frameBufferManager.releaseTemporaryAttachment(attachment1);

        resultAttachment = finalAttachment;
    } else {
        // 使わなかったバッファを解放
        const unusedIndex = (attachmentIndex + 1) % 2;
        frameBufferManager.releaseTemporaryAttachment(attachments[unusedIndex]);
    }

    return resultAttachment;
};

/**
 * @description テクスチャをアタッチメントにコピー（オフセット位置に配置、スケーリング対応）
 *
 * @param source - ソーステクスチャ
 * @param dest - デストテクスチャ（ソースより大きい）
 * @param bufferScaleX - X方向のバッファスケール
 * @param bufferScaleY - Y方向のバッファスケール
 * @param pixelOffsetX - デスト内でのX方向オフセット（ピクセル単位、スケーリング済み）
 * @param pixelOffsetY - デスト内でのY方向オフセット（ピクセル単位、スケーリング済み）
 */
const copyTextureToAttachment = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    frameBufferManager: IFilterConfig["frameBufferManager"],
    pipelineManager: IFilterConfig["pipelineManager"],
    source: IAttachmentObject,
    dest: IAttachmentObject,
    sampler: GPUSampler,
    bufferScaleX: number,
    bufferScaleY: number,
    pixelOffsetX: number,
    pixelOffsetY: number,
    bufferManager?: IFilterConfig["bufferManager"]
): void => {
    // texture_copy_rgba8を使用し、ビューポートでオフセットを制御
    const pipeline = pipelineManager.getPipeline("texture_copy_rgba8");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU BlurFilter] texture_copy_rgba8 pipeline not found");
        return;
    }

    // デスト内でのソース描画サイズ（スケーリング後）
    const scaledSourceWidth = source.width * bufferScaleX;
    const scaledSourceHeight = source.height * bufferScaleY;

    // シェーダー: uv = texCoord * scale + offset
    // ソース全体をサンプリングするので scale = 1, offset = 0
    const scaleX = 1;
    const scaleY = 1;
    const offsetX = 0;
    const offsetY = 0;

    // ユニフォームバッファ: scale(2) + offset(2)
    $uniform4[0] = scaleX;
    $uniform4[1] = scaleY;
    $uniform4[2] = offsetX;
    $uniform4[3] = offsetY;
    const uniformBuffer = bufferManager
        ? bufferManager.acquireAndWriteUniformBuffer($uniform4)
        : device.createBuffer({
            "size": $uniform4.byteLength,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    if (!bufferManager) {
        device.queue.writeBuffer(uniformBuffer, 0, $uniform4);
    }

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = source.texture!.view;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        dest.texture!.view, 0, 0, 0, 0, "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);

    // ビューポートを設定してオフセット位置に描画
    passEncoder.setViewport(
        pixelOffsetX, pixelOffsetY,
        scaledSourceWidth, scaledSourceHeight,
        0, 1
    );
    passEncoder.setScissorRect(
        Math.floor(pixelOffsetX), Math.floor(pixelOffsetY),
        Math.ceil(scaledSourceWidth), Math.ceil(scaledSourceHeight)
    );

    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();
    // Note: uniformBuffer is not destroyed here - it will be garbage collected after GPU submission
};

/**
 * @description 方向ブラーを適用
 */
const applyDirectionalBlur = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    frameBufferManager: IFilterConfig["frameBufferManager"],
    pipelineManager: IFilterConfig["pipelineManager"],
    source: IAttachmentObject,
    dest: IAttachmentObject,
    sampler: GPUSampler,
    isHorizontal: boolean,
    blur: number,
    bufferManager?: IFilterConfig["bufferManager"]
): void => {
    const params = calculateDirectionalBlurParams(
        isHorizontal, blur,
        source.width, source.height
    );

    const { offsetX, offsetY, fraction, samples, halfBlur } = params;

    // halfBlurに対応するパイプラインを取得（1〜16の範囲でクランプ）
    const clampedHalfBlur = Math.max(1, Math.min(16, halfBlur));
    const pipeline = pipelineManager.getPipeline(`blur_filter_${clampedHalfBlur}`);
    const bindGroupLayout = pipelineManager.getBindGroupLayout("blur_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error(`[WebGPU BlurFilter] blur_filter_${clampedHalfBlur} pipeline not found`);
        return;
    }

    // ユニフォームバッファ: offset(2) + fraction + samples
    $uniform4[0] = offsetX;
    $uniform4[1] = offsetY;
    $uniform4[2] = fraction;
    $uniform4[3] = samples;
    const uniformBuffer = bufferManager
        ? bufferManager.acquireAndWriteUniformBuffer($uniform4)
        : device.createBuffer({
            "size": $uniform4.byteLength,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    if (!bufferManager) {
        device.queue.writeBuffer(uniformBuffer, 0, $uniform4);
    }

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = source.texture!.view;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        dest.texture!.view, 0, 0, 0, 0, "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();
    // Note: uniformBuffer is not destroyed here - it will be garbage collected after GPU submission
};

/**
 * @description テクスチャをアップスケール（ソース全体をデスト全体にマッピング）
 */
const upscaleTexture = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    frameBufferManager: IFilterConfig["frameBufferManager"],
    pipelineManager: IFilterConfig["pipelineManager"],
    source: IAttachmentObject,
    dest: IAttachmentObject,
    sampler: GPUSampler,
    bufferManager?: IFilterConfig["bufferManager"]
): void => {
    // temp_アタッチメントはrgba8unormフォーマットなので、texture_copy_rgba8パイプラインを使用
    const pipeline = pipelineManager.getPipeline("texture_copy_rgba8");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU BlurFilter] texture_copy_rgba8 pipeline not found");
        return;
    }

    // アップスケールではソース全体をデスト全体にマッピング
    // シェーダー: uv = (texCoord - offset) * scale
    // scale = 1, offset = 0 で uv = texCoord となり、ソース全体がデスト全体にマッピングされる
    $uniform4[0] = 1;
    $uniform4[1] = 1;
    $uniform4[2] = 0;
    $uniform4[3] = 0;
    const uniformBuffer = bufferManager
        ? bufferManager.acquireAndWriteUniformBuffer($uniform4)
        : device.createBuffer({
            "size": $uniform4.byteLength,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    if (!bufferManager) {
        device.queue.writeBuffer(uniformBuffer, 0, $uniform4);
    }

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = source.texture!.view;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        dest.texture!.view, 0, 0, 0, 0, "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();
};
