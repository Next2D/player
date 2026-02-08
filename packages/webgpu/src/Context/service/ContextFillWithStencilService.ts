import type { PipelineManager } from "../../Shader/PipelineManager";

export const execute = (
    render_pass_encoder: GPURenderPassEncoder,
    pipeline_manager: PipelineManager,
    vertex_buffer: GPUBuffer,
    vertex_count: number
): void => {
    // アトラス描画時はメインキャンバスのマスク状態を参照しない
    // アトラスのステンシルはシェイプの塗りつぶし用で、マスク処理とは独立

    // === Pass 1: ステンシル書き込み（両面を1回で処理） ===
    // Front面: INCR_WRAP, Back面: DECR_WRAP
    // アトラス用パイプライン（sampleCount: 1）を使用
    const stencilWritePipeline = pipeline_manager.getPipeline("stencil_write_atlas");
    if (stencilWritePipeline) {
        render_pass_encoder.setPipeline(stencilWritePipeline);
        render_pass_encoder.setStencilReference(0);
        render_pass_encoder.setVertexBuffer(0, vertex_buffer);
        render_pass_encoder.draw(vertex_count, 1, 0, 0);
    }

    // === Pass 2: ステンシルフィル（色描画） ===
    // アトラス描画時は常に通常モード: ステンシル != 0 の部分に描画し、ステンシルをクリア
    // アトラス用パイプライン（sampleCount: 1）を使用
    const fillPipeline = pipeline_manager.getPipeline("stencil_fill_atlas");
    if (fillPipeline) {
        render_pass_encoder.setPipeline(fillPipeline);
        render_pass_encoder.setStencilReference(0);
        render_pass_encoder.setVertexBuffer(0, vertex_buffer);
        render_pass_encoder.draw(vertex_count, 1, 0, 0);
    }
};
