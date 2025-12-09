import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @description 複雑なブレンドモード処理の設定
 *              Complex blend mode processing configuration
 */
interface IComplexBlendConfig {
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
 * @description 複雑なブレンドモードを適用
 *              Apply complex blend mode
 *
 * @param  {IAttachmentObject} srcAttachment - ソーステクスチャ（描画するオブジェクト）
 * @param  {IAttachmentObject} dstAttachment - デスティネーションテクスチャ（描画先の現在の内容）
 * @param  {string} blendMode - ブレンドモード
 * @param  {Float32Array} colorTransform - カラートランスフォーム [mulR, mulG, mulB, mulA, addR, addG, addB, addA]
 * @param  {IComplexBlendConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - ブレンド結果のアタッチメント
 */
export const execute = (
    srcAttachment: IAttachmentObject,
    dstAttachment: IAttachmentObject,
    blendMode: string,
    colorTransform: Float32Array,
    config: IComplexBlendConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 出力サイズは両方の大きい方を使用
    const width = Math.max(srcAttachment.width, dstAttachment.width);
    const height = Math.max(srcAttachment.height, dstAttachment.height);

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    const pipeline = pipelineManager.getPipeline(`complex_blend_${blendMode}`);
    const bindGroupLayout = pipelineManager.getBindGroupLayout("complex_blend");

    if (!pipeline || !bindGroupLayout) {
        console.error(`[WebGPU ComplexBlend] Pipeline not found for blend mode: ${blendMode}`);
        // フォールバック: srcをそのまま返す
        return srcAttachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("complex_blend_sampler", true);

    // ユニフォームバッファを作成
    // mulColor: vec4<f32> (16 bytes)
    // addColor: vec4<f32> (16 bytes)
    // Total: 32 bytes
    const uniformData = new Float32Array([
        colorTransform[0], colorTransform[1], colorTransform[2], colorTransform[3],  // mulColor
        colorTransform[4], colorTransform[5], colorTransform[6], colorTransform[7]   // addColor
    ]);

    const uniformBuffer = device.createBuffer({
        size: uniformData.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    // バインドグループを作成
    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: dstAttachment.texture!.view },
            { binding: 3, resource: srcAttachment.texture!.view }
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

    return destAttachment;
};
