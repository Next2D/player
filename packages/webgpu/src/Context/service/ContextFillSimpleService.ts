import type { PipelineManager } from "../../Shader/PipelineManager";
import { $isMaskDrawing, $getMaskStencilReference } from "../../Mask";

export const execute = (
    device: GPUDevice,
    render_pass_encoder: GPURenderPassEncoder,
    pipeline_manager: PipelineManager,
    vertex_buffer: GPUBuffer,
    vertex_count: number,
    uniform_buffer: GPUBuffer,
    use_atlas_target: boolean,
    use_stencil_pipeline: boolean = false,
    _clip_level: number = 1
): void => {

    // バインドグループを作成（uniform_bufferはfill uniformを含む）
    const bindGroupLayout = pipeline_manager.getBindGroupLayout("fill");
    if (!bindGroupLayout) {
        console.error("[WebGPU] Fill bind group layout not found");
        return;
    }

    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [{
            "binding": 0,
            "resource": { "buffer": uniform_buffer }
        }]
    });

    let pipelineName: string;
    if (use_atlas_target) {
        pipelineName = "fill";
    } else if (use_stencil_pipeline) {
        if ($isMaskDrawing()) {
            return;
        }
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

    if (use_stencil_pipeline && !use_atlas_target && !$isMaskDrawing()) {
        render_pass_encoder.setStencilReference($getMaskStencilReference());
    }

    render_pass_encoder.draw(vertex_count, 1, 0, 0);
};
