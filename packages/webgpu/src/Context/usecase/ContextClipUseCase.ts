import type { IPath } from "../../interface/IPath";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { $clipBounds, $clipLevels } from "../../Mask";

/**
 * @description マスク処理を実行
 *              WebGL版と同様にステンシルバッファを使用したクリッピング
 *              Execute clipping using stencil buffer (same as WebGL version)
 *
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {BufferManager} bufferManager
 * @param {PipelineManager} pipelineManager
 * @param {IAttachmentObject} currentAttachment - 現在のアタッチメント
 * @param {IPath[]} pathVertices - パス頂点
 * @param {Float32Array} contextMatrix - コンテキストの変換行列
 * @param {Float32Array} fillStyle - 塗りつぶしスタイル [r, g, b, a]
 * @param {number} globalAlpha - グローバルアルファ値
 * @return {void}
 */
export const execute = (
    renderPassEncoder: GPURenderPassEncoder,
    bufferManager: BufferManager,
    pipelineManager: PipelineManager,
    currentAttachment: IAttachmentObject,
    pathVertices: IPath[],
    contextMatrix: Float32Array,
    fillStyle: Float32Array,
    globalAlpha: number
): void => {
    // クリップ境界を取得
    const bounds = $clipBounds.get(currentAttachment.clipLevel);
    if (!bounds) {
        return;
    }

    const xMin = bounds[0];
    const yMin = bounds[1];
    const xMax = bounds[2];
    const yMax = bounds[3];

    const width = Math.ceil(Math.abs(xMax - xMin));
    const height = Math.ceil(Math.abs(yMax - yMin));

    // メッシュを生成
    const viewportWidth = currentAttachment.width;
    const viewportHeight = currentAttachment.height;

    const red = fillStyle[0];
    const green = fillStyle[1];
    const blue = fillStyle[2];
    const alpha = fillStyle[3] * globalAlpha;

    if (pathVertices.length === 0) {
        return;
    }

    const mesh = meshFillGenerateUseCase(
        pathVertices,
        contextMatrix[0], contextMatrix[1],
        contextMatrix[3], contextMatrix[4],
        contextMatrix[6], contextMatrix[7],
        red, green, blue, alpha,
        viewportWidth, viewportHeight
    );

    if (mesh.indexCount === 0) {
        return;
    }

    // 頂点バッファを作成
    const vertexBuffer = bufferManager.createVertexBuffer(
        `clip_${Date.now()}`,
        mesh.buffer
    );

    // クリップレベルを取得
    let level = $clipLevels.get(currentAttachment.clipLevel) || 1;

    // ステンシルパイプラインを取得
    const pipeline = pipelineManager.getPipeline("clip_write");
    if (!pipeline) {
        console.error("[WebGPU] clip_write pipeline not found");
        return;
    }

    // シザーレクトを設定
    // シェーダーでY軸反転(-ndc.y)しているため、描画結果はWebGPU座標系になる
    // WebGPUのシザーは左上原点なのでyMinをそのまま使用
    let scissorX = Math.max(0, xMin);
    let scissorY = Math.max(0, yMin);
    let scissorW = Math.min(width, currentAttachment.width - scissorX);
    let scissorH = Math.min(height, currentAttachment.height - scissorY);

    // レンダーターゲット範囲内にクランプ
    scissorX = Math.min(scissorX, currentAttachment.width);
    scissorY = Math.min(scissorY, currentAttachment.height);
    scissorW = Math.max(0, Math.min(scissorW, currentAttachment.width - scissorX));
    scissorH = Math.max(0, Math.min(scissorH, currentAttachment.height - scissorY));

    if (scissorW > 0 && scissorH > 0) {
        renderPassEncoder.setScissorRect(scissorX, scissorY, scissorW, scissorH);
    }

    // ステンシルマスクをビット単位で設定（WebGL版: stencilMask(1 << level - 1)）
    const stencilMask = 1 << (level - 1);

    renderPassEncoder.setPipeline(pipeline);
    renderPassEncoder.setStencilReference(stencilMask);
    renderPassEncoder.setVertexBuffer(0, vertexBuffer);
    renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);

    // レベルをインクリメント
    level++;
    if (level > 7) {
        // ユニオンマスク処理（レベルが7を超えた場合）
        // TODO: MaskUnionMaskService相当の処理
        level = currentAttachment.clipLevel + 1;
    }

    // クリップレベルを更新
    $clipLevels.set(currentAttachment.clipLevel, level);
};
