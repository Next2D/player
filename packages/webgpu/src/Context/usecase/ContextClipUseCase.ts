import type { IPath } from "../../interface/IPath";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { execute as maskUnionMaskService } from "../../Mask/service/MaskUnionMaskService";
import { $clipBounds, $clipLevels } from "../../Mask";
import { isDebugEnabled, logMask } from "../../Debug/DebugLogger";

/**
 * @description マスク処理を実行
 *              WebGL版と同様にステンシルバッファを使用したクリッピング
 *              ビット単位のステンシル操作でネストされたマスクをサポート
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
 * @param {boolean} isMainAttachment - メインアタッチメントへの描画かどうか
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
    globalAlpha: number,
    isMainAttachment: boolean = false
): void => {
    // クリップ境界を取得
    const clipLevel = currentAttachment.clipLevel;
    const bounds = $clipBounds.get(clipLevel);
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

    // 現在のマスクレベルを取得（WebGL版: $clipLevels.get(clipLevel)）
    // レベルは1から始まり、各パスごとにインクリメントされる
    let level = $clipLevels.get(clipLevel) ?? clipLevel;

    // ステンシルパイプラインを取得
    // メインアタッチメント: レベルに対応するパイプライン（stencilWriteMask = 1 << (level - 1)）
    // アトラス: 通常のクリップパイプライン
    let pipelineName: string;
    if (isMainAttachment) {
        // レベルを1-8の範囲にクランプ（8レベルまでサポート）
        const clampedLevel = Math.min(8, Math.max(1, level));
        pipelineName = `clip_write_main_${clampedLevel}`;
    } else {
        pipelineName = "clip_write";
    }

    const pipeline = pipelineManager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        return;
    }

    // シザーレクトは一時的に無効化（マスク全体を描画）
    // WebGL版ではシザーレクトを使用してステンシル書き込みを最適化しているが、
    // 座標系の問題を調査するため一時的に無効化
    // TODO: 座標系の問題を解決後、シザーレクトを再有効化

    // デバッグ用: シザーレクトの計算値を保持（ログ出力用）
    let scissorX = Math.max(0, xMin);
    let scissorY = Math.max(0, isMainAttachment ? currentAttachment.height - yMax : yMin);
    let scissorW = Math.min(width, currentAttachment.width - scissorX);
    let scissorH = Math.min(height, currentAttachment.height - scissorY);
    scissorX = Math.min(scissorX, currentAttachment.width);
    scissorY = Math.min(scissorY, currentAttachment.height);
    scissorW = Math.max(0, Math.min(scissorW, currentAttachment.width - scissorX));
    scissorH = Math.max(0, Math.min(scissorH, currentAttachment.height - scissorY));

    // INVERT操作でマスク形状を描画
    // カバーされたピクセルのステンシル値が反転される（ビット単位）
    // 奇数回カバーされたピクセルのみがマスク領域となる
    renderPassEncoder.setPipeline(pipeline);
    renderPassEncoder.setStencilReference(0); // INVERT操作では参照値は使用されないが、設定は必要
    renderPassEncoder.setVertexBuffer(0, vertexBuffer);
    renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);

    // デバッグ出力
    if (isDebugEnabled()) {
        logMask("ContextClipUseCase execute (mask shape drawn)", {
            "clipLevel": clipLevel,
            "maskValue": 1 << level - 1,
            "isMaskDrawing": true
        });
        console.log("[WebGPU Mask] Clip pipeline used:", pipelineName);
        console.log("[WebGPU Mask] Vertex count:", mesh.indexCount);
        console.log("[WebGPU Mask] Scissor rect:", { scissorX, scissorY, scissorW, scissorH });
        console.log("[WebGPU Mask] Bounds:", { xMin, yMin, xMax, yMax });
        console.log("[WebGPU Mask] Attachment size:", currentAttachment.width, "x", currentAttachment.height);
    }

    // レベルをインクリメント（WebGL版: ++level）
    level++;

    // レベルが8を超えた場合、ステンシルビットをマージして再利用
    // WebGL版: if (level > 7) { maskUnionMaskService(); level = clipLevel + 1; }
    if (level > 8) {
        maskUnionMaskService(
            renderPassEncoder,
            bufferManager,
            pipelineManager,
            currentAttachment
        );
        level = clipLevel + 1;

        if (isDebugEnabled()) {
            logMask("ContextClipUseCase maskUnion called", {
                "clipLevel": clipLevel
            });
            console.log("[WebGPU Mask] New level:", level, "Reason: level exceeded 8");
        }
    }

    $clipLevels.set(clipLevel, level);
};
