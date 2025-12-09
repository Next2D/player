import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @description カラーマトリックスフィルター処理の設定
 *              Color matrix filter processing configuration
 */
interface IColorMatrixConfig {
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
 * @description カラーマトリックスフィルターを適用
 *              Apply color matrix filter
 *
 * @param  {IAttachmentObject} sourceAttachment - 入力テクスチャ（アタッチメント）
 * @param  {Float32Array} matrix - 4x5カラーマトリックス (20 floats)
 * @param  {IColorMatrixConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    sourceAttachment: IAttachmentObject,
    matrix: Float32Array,
    config: IColorMatrixConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(
        sourceAttachment.width,
        sourceAttachment.height
    );

    const pipeline = pipelineManager.getPipeline("color_matrix_filter");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("color_matrix_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU ColorMatrixFilter] Pipeline not found");
        return sourceAttachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("color_matrix_sampler", true);

    // ユニフォームバッファを作成
    // 4x4 matrix (64 bytes) + offset vec4 (16 bytes) = 80 bytes
    // WebGPUのmat4x4は列優先なので、入力の4x5行列を変換
    // 入力: [r0, r1, r2, r3, r4, g0, g1, g2, g3, g4, b0, b1, b2, b3, b4, a0, a1, a2, a3, a4]
    // 出力: mat4x4 (row-wise to column-wise) + offset vec4
    const mat4x4 = new Float32Array([
        // Column 0: R coefficients
        matrix[0], matrix[5], matrix[10], matrix[15],
        // Column 1: G coefficients
        matrix[1], matrix[6], matrix[11], matrix[16],
        // Column 2: B coefficients
        matrix[2], matrix[7], matrix[12], matrix[17],
        // Column 3: A coefficients
        matrix[3], matrix[8], matrix[13], matrix[18]
    ]);

    // Offset values (R, G, B, A) - normalized to 0-1 range (input is 0-255)
    const offset = new Float32Array([
        matrix[4] / 255,
        matrix[9] / 255,
        matrix[14] / 255,
        matrix[19] / 255
    ]);

    const uniformData = new Float32Array(20);
    uniformData.set(mat4x4, 0);
    uniformData.set(offset, 16);

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
            { binding: 2, resource: sourceAttachment.texture!.view }
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
