import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { $isMaskDrawing, $getMaskStencilReference } from "../../Mask";

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
 * @param {boolean} useStencilPipeline - マスクモード時にステンシル付きパイプラインを使用
 * @param {number} clipLevel - マスク描画時のクリップレベル（1-8）
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    render_pass_encoder: GPURenderPassEncoder,
    buffer_manager: BufferManager,
    pipeline_manager: PipelineManager,
    vertex_buffer: GPUBuffer,
    vertex_count: number,
    viewport_width: number,
    viewport_height: number,
    use_atlas_target: boolean,
    use_stencil_pipeline: boolean = false,
    _clip_level: number = 1
): void => {
    // Uniform data: viewport size only (8 bytes → 16 bytes aligned)
    const uniformData = new Float32Array(4);
    uniformData[0] = viewport_width;
    uniformData[1] = viewport_height;
    uniformData[2] = 0;
    uniformData[3] = 0;

    const uniformBuffer = buffer_manager.acquireUniformBuffer(uniformData.byteLength);
    device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    // バインドグループを作成
    const bindGroupLayout = pipeline_manager.getBindGroupLayout("fill");
    if (!bindGroupLayout) {
        console.error("[WebGPU] Fill bind group layout not found");
        return;
    }

    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [{
            "binding": 0,
            "resource": { "buffer": uniformBuffer }
        }]
    });

    // パイプラインを取得して描画
    // - アトラス用: "fill" (rgba8unorm)
    // - キャンバス用: "fill_bgra" (bgra8unorm, ステンシルなし)
    // - マスク描画モード時: 何もしない（clip()でステンシル書き込み）
    // - マスクテストモード時: "fill_bgra_stencil" (bgra8unorm, ステンシルテストあり)
    let pipelineName: string;
    if (use_atlas_target) {
        pipelineName = "fill";
    } else if (use_stencil_pipeline) {
        if ($isMaskDrawing()) {
            // マスク描画モード: ステンシルへの書き込みはclip()で行うため、ここでは何もしない
            // clip()がINVERTでステンシルを書き込み、重複書き込みによるINVERT打ち消しを防止
            return;
        }
        // マスクテストモード: ステンシル値をテストしてカラーを描画
        // WebGL版: stencilFunc(EQUAL, mask & 0xff, mask)
        pipelineName = "fill_bgra_stencil";

    } else {
        pipelineName = "fill_bgra";
    }
    const pipeline = pipeline_manager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        return;
    }

    render_pass_encoder.setPipeline(pipeline);
    render_pass_encoder.setVertexBuffer(0, vertex_buffer);
    render_pass_encoder.setBindGroup(0, bindGroup);

    // マスクテストモード時はステンシル参照値を設定
    // WebGL版: stencilFunc(EQUAL, mask & 0xff, mask)
    if (use_stencil_pipeline && !use_atlas_target && !$isMaskDrawing()) {
        render_pass_encoder.setStencilReference($getMaskStencilReference());
    }

    render_pass_encoder.draw(vertex_count, 1, 0, 0);
};
