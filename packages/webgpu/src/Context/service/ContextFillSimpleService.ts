import type { PipelineManager } from "../../Shader/PipelineManager";
import { $isMaskDrawing, $getMaskStencilReference } from "../../Mask";

/**
 * @description シンプルなフィル描画を実行する
 *              Executes simple fill rendering
 * @param {GPURenderPassEncoder} render_pass_encoder レンダーパスエンコーダ / Render pass encoder
 * @param {PipelineManager} pipeline_manager パイプラインマネージャ / Pipeline manager
 * @param {GPUBuffer} vertex_buffer 頂点バッファ / Vertex buffer
 * @param {number} vertex_count 頂点数 / Vertex count
 * @param {GPUBindGroup} bind_group バインドグループ / Bind group
 * @param {number} uniform_offset ユニフォームオフセット / Uniform offset
 * @param {boolean} use_atlas_target アトラスターゲット使用フラグ / Whether to use atlas target
 * @param {boolean} use_stencil_pipeline ステンシルパイプライン使用フラグ / Whether to use stencil pipeline
 * @param {number} _clip_level クリップレベル（未使用） / Clip level (unused)
 * @return {void}
 */
export const execute = (
    render_pass_encoder: GPURenderPassEncoder,
    pipeline_manager: PipelineManager,
    vertex_buffer: GPUBuffer,
    vertex_count: number,
    bind_group: GPUBindGroup,
    uniform_offset: number,
    use_atlas_target: boolean,
    use_stencil_pipeline: boolean = false,
    _clip_level: number = 1
): void => {

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
    render_pass_encoder.setBindGroup(0, bind_group, [uniform_offset]);

    if (use_stencil_pipeline && !use_atlas_target && !$isMaskDrawing()) {
        render_pass_encoder.setStencilReference($getMaskStencilReference());
    }

    render_pass_encoder.draw(vertex_count, 1, 0, 0);
};
