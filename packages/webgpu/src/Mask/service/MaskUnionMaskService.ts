import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @description フルスクリーン矩形の頂点データ（4 floats/vertex: position + bezier）
 *              Full-screen rectangle vertex data (4 floats/vertex: position + bezier)
 *
 * @type {Float32Array}
 * @constant
 */
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

/**
 * @description FillUniformsデータ: 恒等行列と白色（NDC座標なので変換不要）
 *              FillUniforms data: identity matrix + white color (no transform needed for NDC coordinates)
 *
 * @type {Float32Array}
 * @constant
 */
const $uniformData16 = new Float32Array([
    1, 1, 1, 1,    // color: white
    0.5, 0, 0, 0,  // matrix0: (0.5, 0, 0, pad) → identity-like for NDC passthrough
    0, 0.5, 0, 0,  // matrix1: (0, 0.5, 0, pad)
    0.5, 0.5, 1, 0 // matrix2: (0.5, 0.5, 1, pad)
]);

/**
 * @description マスクの合成処理（ネストされたマスク対応）
 *              Union mask processing for nested masks.
 *              WebGL版と同様に、レベル7を超えたステンシルビットをマージする
 *              Merges stencil bits exceeding level 7, same as WebGL version.
 *
 * @param  {GPUDevice} device - GPUデバイス / GPU device
 * @param  {GPURenderPassEncoder} render_pass_encoder - レンダーパスエンコーダ / Render pass encoder
 * @param  {BufferManager} buffer_manager - バッファマネージャ / Buffer manager
 * @param  {PipelineManager} pipeline_manager - パイプラインマネージャ / Pipeline manager
 * @param  {IAttachmentObject} current_attachment - 現在のアタッチメントオブジェクト / Current attachment object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    render_pass_encoder: GPURenderPassEncoder,
    buffer_manager: BufferManager,
    pipeline_manager: PipelineManager,
    current_attachment: IAttachmentObject
): void => {
    if (!current_attachment) {
        return;
    }

    const clipLevel = current_attachment.clipLevel;
    const mask = 1 << clipLevel - 1;

    const vertexBuffer = buffer_manager.acquireVertexBuffer($rectVertices.byteLength, $rectVertices);

    // Dynamic Uniform Bufferにデータを書き込み
    const uniformOffset = buffer_manager.dynamicUniform.allocate($uniformData16);

    // Dynamic BindGroupを取得
    const layout = pipeline_manager.getBindGroupLayout("fill_dynamic");
    if (!layout) {
        return;
    }
    const bindGroup = device.createBindGroup({
        "layout": layout,
        "entries": [{
            "binding": 0,
            "resource": {
                "buffer": buffer_manager.dynamicUniform.getBuffer(),
                "size": 256
            }
        }]
    });

    // === Pass 1: ステンシルビットのマージ ===
    const mergePipeline = pipeline_manager.getPipeline(`mask_union_merge_${clipLevel}`);
    if (mergePipeline) {
        render_pass_encoder.setPipeline(mergePipeline);
        render_pass_encoder.setStencilReference(mask);
        render_pass_encoder.setVertexBuffer(0, vertexBuffer);
        render_pass_encoder.setBindGroup(0, bindGroup, [uniformOffset]);
        render_pass_encoder.draw(6, 1, 0, 0);
    }

    // === Pass 2: 上位ビットのクリア ===
    const clearPipeline = pipeline_manager.getPipeline(`mask_union_clear_${clipLevel}`);
    if (clearPipeline) {
        render_pass_encoder.setPipeline(clearPipeline);
        render_pass_encoder.setStencilReference(0);
        render_pass_encoder.setVertexBuffer(0, vertexBuffer);
        render_pass_encoder.setBindGroup(0, bindGroup, [uniformOffset]);
        render_pass_encoder.draw(6, 1, 0, 0);
    }
};
