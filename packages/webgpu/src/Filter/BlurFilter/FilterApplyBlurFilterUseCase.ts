import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { $offset } from "../index";
import { calculateBlurParams, calculateDirectionalBlurParams } from "../BlurFilterUseCase";

/**
 * @description ブラー処理の設定
 *              Blur processing configuration
 */
interface IBlurConfig {
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
 * @description ブラーフィルターを適用
 *              Apply blur filter
 *
 * @param  {IAttachmentObject} sourceAttachment - 入力テクスチャ（アタッチメント）
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} blurX - X方向のブラー量
 * @param  {number} blurY - Y方向のブラー量
 * @param  {number} quality - クオリティ (1-15)
 * @param  {number} devicePixelRatio - デバイスピクセル比
 * @param  {IBlurConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    sourceAttachment: IAttachmentObject,
    matrix: Float32Array,
    blurX: number,
    blurY: number,
    quality: number,
    devicePixelRatio: number,
    config: IBlurConfig
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
        offsetX * bufferScaleX, offsetY * bufferScaleY
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
                true, bufferBlurX
            );
        }

        // 垂直ブラー
        if (blurY > 0) {
            const srcIndex = attachmentIndex;
            attachmentIndex = (attachmentIndex + 1) % 2;

            applyDirectionalBlur(
                device, commandEncoder, frameBufferManager, pipelineManager,
                attachments[srcIndex], attachments[attachmentIndex], sampler,
                false, bufferBlurY
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
            1 / bufferScaleX, 1 / bufferScaleY
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
 * @description テクスチャをアタッチメントにコピー
 */
const copyTextureToAttachment = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    frameBufferManager: IBlurConfig["frameBufferManager"],
    pipelineManager: IBlurConfig["pipelineManager"],
    source: IAttachmentObject,
    dest: IAttachmentObject,
    sampler: GPUSampler,
    scaleX: number,
    scaleY: number,
    offsetX: number,
    offsetY: number
): void => {
    const pipeline = pipelineManager.getPipeline("texture_copy");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU BlurFilter] texture_copy pipeline not found");
        return;
    }

    // ユニフォームバッファ: scale(2) + offset(2)
    const uniformData = new Float32Array([
        scaleX, scaleY,
        offsetX / dest.width, offsetY / dest.height
    ]);
    const uniformBuffer = device.createBuffer({
        size: uniformData.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: source.textureView }
        ]
    });

    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        dest.textureView, 0, 0, 0, 0, "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    uniformBuffer.destroy();
};

/**
 * @description 方向ブラーを適用
 */
const applyDirectionalBlur = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    frameBufferManager: IBlurConfig["frameBufferManager"],
    pipelineManager: IBlurConfig["pipelineManager"],
    source: IAttachmentObject,
    dest: IAttachmentObject,
    sampler: GPUSampler,
    isHorizontal: boolean,
    blur: number
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
    const uniformData = new Float32Array([offsetX, offsetY, fraction, samples]);
    const uniformBuffer = device.createBuffer({
        size: uniformData.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: source.textureView }
        ]
    });

    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        dest.textureView, 0, 0, 0, 0, "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    uniformBuffer.destroy();
};

/**
 * @description テクスチャをアップスケール
 */
const upscaleTexture = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    frameBufferManager: IBlurConfig["frameBufferManager"],
    pipelineManager: IBlurConfig["pipelineManager"],
    source: IAttachmentObject,
    dest: IAttachmentObject,
    sampler: GPUSampler,
    scaleX: number,
    scaleY: number
): void => {
    const pipeline = pipelineManager.getPipeline("texture_copy");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU BlurFilter] texture_copy pipeline not found");
        return;
    }

    // ユニフォームバッファ: scale(2) + offset(2)
    const uniformData = new Float32Array([scaleX, scaleY, 0, 0]);
    const uniformBuffer = device.createBuffer({
        size: uniformData.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: source.textureView }
        ]
    });

    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        dest.textureView, 0, 0, 0, 0, "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    uniformBuffer.destroy();
};
