import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";

/**
 * @description 単純なフィル（ステンシルなし、キャンバス描画用）
 *              Simple fill without stencil for canvas rendering
 *
 * @param {GPUDevice} device
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {BufferManager} bufferManager
 * @param {PipelineManager} pipelineManager
 * @param {GPUBuffer} vertexBuffer
 * @param {number} vertexCount
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @param {boolean} useAtlasTarget - アトラスターゲットを使用するかどうか
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    renderPassEncoder: GPURenderPassEncoder,
    bufferManager: BufferManager,
    pipelineManager: PipelineManager,
    vertexBuffer: GPUBuffer,
    vertexCount: number,
    viewportWidth: number,
    viewportHeight: number,
    useAtlasTarget: boolean
): void => {
    // Uniform data: viewport size only (8 bytes → 16 bytes aligned)
    const uniformData = new Float32Array(4);
    uniformData[0] = viewportWidth;
    uniformData[1] = viewportHeight;
    uniformData[2] = 0;
    uniformData[3] = 0;

    const uniformBuffer = bufferManager.createUniformBuffer(
        `fill_uniform_${Date.now()}`,
        uniformData.byteLength
    );
    device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    // バインドグループを作成
    const bindGroupLayout = pipelineManager.getBindGroupLayout("fill");
    if (!bindGroupLayout) {
        console.error("[WebGPU] Fill bind group layout not found");
        return;
    }

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [{
            binding: 0,
            resource: { buffer: uniformBuffer }
        }]
    });

    // パイプラインを取得して描画（アトラス用かキャンバス用かで切り替え）
    const pipelineName = useAtlasTarget ? "fill" : "fill_bgra";
    const pipeline = pipelineManager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        return;
    }

    renderPassEncoder.setPipeline(pipeline);
    renderPassEncoder.setVertexBuffer(0, vertexBuffer);
    renderPassEncoder.setBindGroup(0, bindGroup);
    renderPassEncoder.draw(vertexCount, 1, 0, 0);
};
