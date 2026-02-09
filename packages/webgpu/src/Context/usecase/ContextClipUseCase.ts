import type { IPath } from "../../interface/IPath";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { execute as maskUnionMaskService } from "../../Mask/service/MaskUnionMaskService";
import { $clipLevels } from "../../Mask";

const $clipUniform16 = new Float32Array(16);

export const execute = (
    device: GPUDevice,
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

    const mesh = meshFillGenerateUseCase(path_vertices);

    if (mesh.indexCount === 0) {
        return;
    }

    // 頂点バッファを取得（プールから再利用）
    const vertexBuffer = buffer_manager.acquireVertexBuffer(mesh.buffer.byteLength, mesh.buffer);

    // Uniform bufferにcolor/matrixを書き込み
    const a  = context_matrix[0];
    const b  = context_matrix[1];
    const c  = context_matrix[3];
    const d  = context_matrix[4];
    const tx = context_matrix[6];
    const ty = context_matrix[7];

    $clipUniform16[0] = red;
    $clipUniform16[1] = green;
    $clipUniform16[2] = blue;
    $clipUniform16[3] = alpha;
    $clipUniform16[4] = a / viewportWidth;
    $clipUniform16[5] = b / viewportHeight;
    $clipUniform16[6] = 0;
    $clipUniform16[7] = 0;
    $clipUniform16[8] = c / viewportWidth;
    $clipUniform16[9] = d / viewportHeight;
    $clipUniform16[10] = 0;
    $clipUniform16[11] = 0;
    $clipUniform16[12] = tx / viewportWidth;
    $clipUniform16[13] = ty / viewportHeight;
    $clipUniform16[14] = 1;
    $clipUniform16[15] = 0;

    // Dynamic Uniform Bufferにデータを書き込み
    const uniformOffset = buffer_manager.dynamicUniform.allocate($clipUniform16);

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

    // Dynamic BindGroupを取得
    const layout = pipeline_manager.getBindGroupLayout("fill_dynamic");
    if (!layout) {
        return;
    }
    const bindGroup = device.createBindGroup({
        "layout": layout,
        "entries": [{
            "binding": 0,
            "resource": {
                "buffer": buffer_manager.dynamicUniform.getBuffer(),
                "size": 256
            }
        }]
    });

    // INVERT操作でマスク形状を描画
    // カバーされたピクセルのステンシル値が反転される（ビット単位）
    // 奇数回カバーされたピクセルのみがマスク領域となる
    render_pass_encoder.setPipeline(pipeline);
    render_pass_encoder.setStencilReference(0); // INVERT操作では参照値は使用されないが、設定は必要
    render_pass_encoder.setVertexBuffer(0, vertexBuffer);
    render_pass_encoder.setBindGroup(0, bindGroup, [uniformOffset]);
    render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);

    // レベルをインクリメント（WebGL版: ++level）
    level++;

    // レベルが8を超えた場合、ステンシルビットをマージして再利用
    // WebGL版: if (level > 7) { maskUnionMaskService(); level = clipLevel + 1; }
    if (level > 8) {
        maskUnionMaskService(
            device,
            render_pass_encoder,
            buffer_manager,
            pipeline_manager,
            current_attachment
        );
        level = clipLevel + 1;
    }

    $clipLevels.set(clipLevel, level);
};
