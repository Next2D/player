import type { PipelineManager } from "../../Shader/PipelineManager";

/**
 * @description 2パスステンシルフィル（WebGL版と同じアルゴリズム）
 *              Pass 1: Front面でインクリメント、Back面でデクリメント（1回の描画で両面処理）
 *              Pass 2: ステンシル値 != 0 の部分に色を描画
 *
 *              注意: この関数はアトラス描画時のみ呼ばれる
 *              アトラスのステンシルはメインキャンバスのマスク処理とは独立
 *              メインキャンバスのマスク状態（$isMaskTestEnabled）は参照しない
 *
 *              WebGL版:
 *              - stencilOpSeparate(FRONT, INCR_WRAP) + stencilOpSeparate(BACK, DECR_WRAP)
 *              - stencilFunc(NOTEQUAL, 0) + stencilOp(KEEP, ZERO, ZERO)
 *
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {PipelineManager} pipelineManager
 * @param {GPUBuffer} vertexBuffer
 * @param {number} vertexCount
 * @return {void}
 */
export const execute = (
    renderPassEncoder: GPURenderPassEncoder,
    pipelineManager: PipelineManager,
    vertexBuffer: GPUBuffer,
    vertexCount: number
): void => {
    // アトラス描画時はメインキャンバスのマスク状態を参照しない
    // アトラスのステンシルはシェイプの塗りつぶし用で、マスク処理とは独立

    // === Pass 1: ステンシル書き込み（両面を1回で処理） ===
    // Front面: INCR_WRAP, Back面: DECR_WRAP
    // アトラス用パイプライン（sampleCount: 1）を使用
    const stencilWritePipeline = pipelineManager.getPipeline("stencil_write_atlas");
    if (stencilWritePipeline) {
        renderPassEncoder.setPipeline(stencilWritePipeline);
        renderPassEncoder.setStencilReference(0);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        renderPassEncoder.draw(vertexCount, 1, 0, 0);
    }

    // === Pass 2: ステンシルフィル（色描画） ===
    // アトラス描画時は常に通常モード: ステンシル != 0 の部分に描画し、ステンシルをクリア
    // アトラス用パイプライン（sampleCount: 1）を使用
    const fillPipeline = pipelineManager.getPipeline("stencil_fill_atlas");
    if (fillPipeline) {
        renderPassEncoder.setPipeline(fillPipeline);
        renderPassEncoder.setStencilReference(0);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        renderPassEncoder.draw(vertexCount, 1, 0, 0);
    }
};
