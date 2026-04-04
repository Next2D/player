import type { PipelineManager } from "../../Shader/PipelineManager";

/**
 * @description メインキャンバス向けのステンシル書き込みとフィル描画を2パスで実行する
 *              Executes two-pass stencil write and fill rendering for the main canvas
 * @param {GPURenderPassEncoder} render_pass_encoder レンダーパスエンコーダ / Render pass encoder
 * @param {PipelineManager} pipeline_manager パイプラインマネージャ / Pipeline manager
 * @param {GPUBuffer} vertex_buffer 頂点バッファ / Vertex buffer
 * @param {number} vertex_count 頂点数 / Vertex count
 * @param {GPUBindGroup} bind_group バインドグループ / Bind group
 * @param {number} uniform_offset ユニフォームオフセット / Uniform offset
 * @return {void}
 */
export const execute = (
    render_pass_encoder: GPURenderPassEncoder,
    pipeline_manager: PipelineManager,
    vertex_buffer: GPUBuffer,
    vertex_count: number,
    bind_group: GPUBindGroup,
    uniform_offset: number
): void => {
    // === Pass 1: ステンシル書き込み（両面を1回で処理） ===
    const stencilWritePipeline = pipeline_manager.getPipeline("stencil_write_main");
    if (stencilWritePipeline) {
        render_pass_encoder.setPipeline(stencilWritePipeline);
        render_pass_encoder.setStencilReference(0);
        render_pass_encoder.setVertexBuffer(0, vertex_buffer);
        render_pass_encoder.setBindGroup(0, bind_group, [uniform_offset]);
        render_pass_encoder.draw(vertex_count, 1, 0, 0);
    }

    // === Pass 2: ステンシルフィル（色描画） ===
    const fillPipeline = pipeline_manager.getPipeline("stencil_fill_main");
    if (fillPipeline) {
        render_pass_encoder.setPipeline(fillPipeline);
        render_pass_encoder.setStencilReference(0);
        render_pass_encoder.setBindGroup(0, bind_group, [uniform_offset]);
        render_pass_encoder.draw(vertex_count, 1, 0, 0);
    }
};
