import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @description マスクの合成処理（ネストされたマスク対応）
 *              WebGL版と同様に、レベル7を超えたステンシルビットをマージする
 *
 * @param {GPUDevice} device
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {BufferManager} bufferManager
 * @param {PipelineManager} pipelineManager
 * @param {IAttachmentObject} currentAttachment
 * @return {void}
 * @method
 * @protected
 */

// フルスクリーン矩形（4 floats/vertex: position + bezier）
const $rectVertices = new Float32Array([
    // Triangle 1
    -1, -1, 0.5, 0.5,
    1, -1, 0.5, 0.5,
    -1, 1, 0.5, 0.5,
    // Triangle 2
    -1, 1, 0.5, 0.5,
    1, -1, 0.5, 0.5,
    1, 1, 0.5, 0.5
]);

// FillUniforms: identity matrix + white color (NDC座標なので変換不要)
const $uniformData16 = new Float32Array([
    1, 1, 1, 1,    // color: white
    0.5, 0, 0, 0,  // matrix0: (0.5, 0, 0, pad) → identity-like for NDC passthrough
    0, 0.5, 0, 0,  // matrix1: (0, 0.5, 0, pad)
    0.5, 0.5, 1, 0 // matrix2: (0.5, 0.5, 1, pad)
]);

export const execute = (
    device: GPUDevice,
    renderPassEncoder: GPURenderPassEncoder,
    bufferManager: BufferManager,
    pipelineManager: PipelineManager,
    currentAttachment: IAttachmentObject
): void => {
    if (!currentAttachment) {
        return;
    }

    const clipLevel = currentAttachment.clipLevel;
    const mask = 1 << clipLevel - 1;

    const vertexBuffer = bufferManager.acquireVertexBuffer($rectVertices.byteLength, $rectVertices);

    // Dynamic Uniform Bufferにデータを書き込み
    const uniformOffset = bufferManager.dynamicUniform.allocate($uniformData16);

    // Dynamic BindGroupを取得
    const layout = pipelineManager.getBindGroupLayout("fill_dynamic");
    if (!layout) {
        return;
    }
    const bindGroup = device.createBindGroup({
        "layout": layout,
        "entries": [{
            "binding": 0,
            "resource": {
                "buffer": bufferManager.dynamicUniform.getBuffer(),
                "size": 256
            }
        }]
    });

    // === Pass 1: ステンシルビットのマージ ===
    const mergePipeline = pipelineManager.getPipeline(`mask_union_merge_${clipLevel}`);
    if (mergePipeline) {
        renderPassEncoder.setPipeline(mergePipeline);
        renderPassEncoder.setStencilReference(mask);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        renderPassEncoder.setBindGroup(0, bindGroup, [uniformOffset]);
        renderPassEncoder.draw(6, 1, 0, 0);
    }

    // === Pass 2: 上位ビットのクリア ===
    const clearPipeline = pipelineManager.getPipeline(`mask_union_clear_${clipLevel}`);
    if (clearPipeline) {
        renderPassEncoder.setPipeline(clearPipeline);
        renderPassEncoder.setStencilReference(0);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        renderPassEncoder.setBindGroup(0, bindGroup, [uniformOffset]);
        renderPassEncoder.draw(6, 1, 0, 0);
    }
};
