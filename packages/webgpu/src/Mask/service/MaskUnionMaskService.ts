import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @description マスクの合成処理（ネストされたマスク対応）
 *              WebGL版と同様に、レベル7を超えたステンシルビットをマージする
 *              Mask synthesis processing for nested masks
 *              Merges stencil bits when level exceeds 7 (same as WebGL version)
 *
 * WebGL版のアルゴリズム:
 * 1. レベル以上のステンシルバッファをマージ
 *    - stencilMask = ~mask - 1 (clipLevelより上のビット)
 *    - stencilFunc = LEQUAL, mask
 *    - stencilOp = ZERO, REPLACE, REPLACE
 *    - フルスクリーン矩形を描画
 *
 * 2. レベル以上のステンシルバッファをクリア
 *    - stencilMask = 1 << clipLevel
 *    - stencilFunc = ALWAYS, 0
 *    - stencilOp = REPLACE, REPLACE, REPLACE
 *    - フルスクリーン矩形を描画
 *
 * 3. 基本マスク設定に戻す
 *    - stencilMask = 0xff
 *    - stencilOp = ZERO, INVERT, INVERT
 *
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {BufferManager} bufferManager
 * @param {PipelineManager} pipelineManager
 * @param {IAttachmentObject} currentAttachment
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
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

    // フルスクリーン矩形の頂点データを作成
    // NDC座標系: -1 to 1
    const rectVertices = new Float32Array([
        // Triangle 1
        -1, -1,  // position
        0.5, 0.5, // bezier (skip curve test)
        1, 1, 1, 1, // color (white)
        1, 0, 0,  // matrix row 0 (identity)
        0, 1, 0,  // matrix row 1
        0, 0, 1,  // matrix row 2
        // v2
        1, -1,
        0.5, 0.5,
        1, 1, 1, 1,
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
        // v3
        -1, 1,
        0.5, 0.5,
        1, 1, 1, 1,
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
        // Triangle 2
        -1, 1,
        0.5, 0.5,
        1, 1, 1, 1,
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
        // v2
        1, -1,
        0.5, 0.5,
        1, 1, 1, 1,
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
        // v3
        1, 1,
        0.5, 0.5,
        1, 1, 1, 1,
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]);

    const vertexBuffer = bufferManager.createVertexBuffer(
        `mask_union_${Date.now()}`,
        rectVertices
    );

    // === Pass 1: ステンシルビットのマージ ===
    // レベル以上のビットをclipLevelビットにマージ
    // WebGL: stencilFunc(LEQUAL, mask, 0xff), stencilOp(ZERO, REPLACE, REPLACE)
    const mergePipeline = pipelineManager.getPipeline(`mask_union_merge_${clipLevel}`);
    if (mergePipeline) {
        renderPassEncoder.setPipeline(mergePipeline);
        renderPassEncoder.setStencilReference(mask);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        renderPassEncoder.draw(6, 1, 0, 0);
    }

    // === Pass 2: 上位ビットのクリア ===
    // clipLevelより上のビットをクリア
    // WebGL: stencilFunc(ALWAYS, 0, 0xff), stencilOp(REPLACE, REPLACE, REPLACE)
    const clearPipeline = pipelineManager.getPipeline(`mask_union_clear_${clipLevel}`);
    if (clearPipeline) {
        renderPassEncoder.setPipeline(clearPipeline);
        renderPassEncoder.setStencilReference(0);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        renderPassEncoder.draw(6, 1, 0, 0);
    }
};
