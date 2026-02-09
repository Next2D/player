import type { PipelineManager } from "../../Shader/PipelineManager";

export const execute = (
    device: GPUDevice,
    render_pass_encoder: GPURenderPassEncoder,
    pipeline_manager: PipelineManager,
    vertex_buffer: GPUBuffer,
    vertex_count: number,
    uniform_buffer: GPUBuffer
): void => {
    // === Pass 1: ステンシル書き込み（両面を1回で処理） ===
    const stencilWritePipeline = pipeline_manager.getPipeline("stencil_write_main");
    if (stencilWritePipeline) {
        const writeBindGroup = device.createBindGroup({
            "layout": stencilWritePipeline.getBindGroupLayout(0),
            "entries": [{
                "binding": 0,
                "resource": { "buffer": uniform_buffer }
            }]
        });
        render_pass_encoder.setPipeline(stencilWritePipeline);
        render_pass_encoder.setStencilReference(0);
        render_pass_encoder.setVertexBuffer(0, vertex_buffer);
        render_pass_encoder.setBindGroup(0, writeBindGroup);
        render_pass_encoder.draw(vertex_count, 1, 0, 0);
    }

    // === Pass 2: ステンシルフィル（色描画） ===
    const fillPipeline = pipeline_manager.getPipeline("stencil_fill_main");
    if (fillPipeline) {
        const fillBindGroup = device.createBindGroup({
            "layout": fillPipeline.getBindGroupLayout(0),
            "entries": [{
                "binding": 0,
                "resource": { "buffer": uniform_buffer }
            }]
        });
        render_pass_encoder.setPipeline(fillPipeline);
        render_pass_encoder.setStencilReference(0);
        render_pass_encoder.setBindGroup(0, fillBindGroup);
        render_pass_encoder.draw(vertex_count, 1, 0, 0);
    }
};
