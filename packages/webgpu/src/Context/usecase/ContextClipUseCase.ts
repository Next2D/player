import type { IPath } from "../../interface/IPath";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { execute as maskUnionMaskService } from "../../Mask/service/MaskUnionMaskService";
import { $clipBounds, $clipLevels } from "../../Mask";

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
    render_pass_encoder: GPURenderPassEncoder,
    buffer_manager: BufferManager,
    pipeline_manager: PipelineManager,
    current_attachment: IAttachmentObject,
    path_vertices: IPath[],
    context_matrix: Float32Array,
    fill_style: Float32Array,
    global_alpha: number,
    is_main_attachment: boolean = false
): void => {
    // クリップ境界を取得
    const clipLevel = current_attachment.clipLevel;
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
    const viewportWidth = current_attachment.width;
    const viewportHeight = current_attachment.height;

    const red = fill_style[0];
    const green = fill_style[1];
    const blue = fill_style[2];
    const alpha = fill_style[3] * global_alpha;

    if (path_vertices.length === 0) {
        return;
    }

    const mesh = meshFillGenerateUseCase(
        path_vertices,
        context_matrix[0], context_matrix[1],
        context_matrix[3], context_matrix[4],
        context_matrix[6], context_matrix[7],
        red, green, blue, alpha,
        viewportWidth, viewportHeight
    );

    if (mesh.indexCount === 0) {
        return;
    }

    // 頂点バッファを取得（プールから再利用）
    const vertexBuffer = buffer_manager.acquireVertexBuffer(mesh.buffer.byteLength, mesh.buffer);

    // 現在のマスクレベルを取得（WebGL版: $clipLevels.get(clipLevel)）
    // レベルは1から始まり、各パスごとにインクリメントされる
    let level = $clipLevels.get(clipLevel) ?? clipLevel;

    // ステンシルパイプラインを取得
    // メインアタッチメント: レベルに対応するパイプライン（stencilWriteMask = 1 << (level - 1)）
    // アトラス: 通常のクリップパイプライン
    let pipelineName: string;
    if (is_main_attachment) {
        // レベルを1-8の範囲にクランプ（8レベルまでサポート）
        const clampedLevel = Math.min(8, Math.max(1, level));
        pipelineName = `clip_write_main_${clampedLevel}`;
    } else {
        pipelineName = "clip_write";
    }

    const pipeline = pipeline_manager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        return;
    }

    // INVERT操作でマスク形状を描画
    // カバーされたピクセルのステンシル値が反転される（ビット単位）
    // 奇数回カバーされたピクセルのみがマスク領域となる
    render_pass_encoder.setPipeline(pipeline);
    render_pass_encoder.setStencilReference(0); // INVERT操作では参照値は使用されないが、設定は必要
    render_pass_encoder.setVertexBuffer(0, vertexBuffer);
    render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);

    // レベルをインクリメント（WebGL版: ++level）
    level++;

    // レベルが8を超えた場合、ステンシルビットをマージして再利用
    // WebGL版: if (level > 7) { maskUnionMaskService(); level = clipLevel + 1; }
    if (level > 8) {
        maskUnionMaskService(
            render_pass_encoder,
            buffer_manager,
            pipeline_manager,
            current_attachment
        );
        level = clipLevel + 1;
    }

    $clipLevels.set(clipLevel, level);
};
