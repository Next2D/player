import type { PipelineManager } from "../../Shader/PipelineManager";
import {
    $isMaskTestEnabled,
    $getMaskStencilReference
} from "../../Mask";

/**
 * @description 2パスステンシルフィル（WebGL版と同じアルゴリズム）
 *              Pass 1: Front面でインクリメント、Back面でデクリメント（1回の描画で両面処理）
 *              Pass 2: ステンシル値 != 0 の部分に色を描画
 *
 *              マスクモード時は stencil_fill_masked を使用し、
 *              ステンシル値 > maskValue の部分のみ描画
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
    const isMasked = $isMaskTestEnabled();
    const maskReference = $getMaskStencilReference();

    // === Pass 1: ステンシル書き込み（両面を1回で処理） ===
    // Front面: INCR_WRAP, Back面: DECR_WRAP
    const stencilWritePipeline = pipelineManager.getPipeline("stencil_write");
    if (stencilWritePipeline) {
        renderPassEncoder.setPipeline(stencilWritePipeline);
        renderPassEncoder.setStencilReference(0);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        renderPassEncoder.draw(vertexCount, 1, 0, 0);
    }

    // === Pass 2: ステンシルフィル（色描画） ===
    if (isMasked) {
        // マスクモード: stencil > maskValue の部分のみ描画
        // 描画後、ステンシルをmaskValueにリセット
        const fillPipeline = pipelineManager.getPipeline("stencil_fill_masked");
        if (fillPipeline) {
            renderPassEncoder.setPipeline(fillPipeline);
            renderPassEncoder.setStencilReference(maskReference);
            renderPassEncoder.setVertexBuffer(0, vertexBuffer);
            renderPassEncoder.draw(vertexCount, 1, 0, 0);
        }
    } else {
        // 通常モード: ステンシル != 0 の部分に描画し、ステンシルをクリア
        const fillPipeline = pipelineManager.getPipeline("stencil_fill");
        if (fillPipeline) {
            renderPassEncoder.setPipeline(fillPipeline);
            renderPassEncoder.setStencilReference(0);
            renderPassEncoder.setVertexBuffer(0, vertexBuffer);
            renderPassEncoder.draw(vertexCount, 1, 0, 0);
        }
    }
};
