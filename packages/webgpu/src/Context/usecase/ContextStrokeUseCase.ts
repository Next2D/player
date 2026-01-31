import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { generateStrokeMesh } from "../../Mesh/usecase/MeshStrokeGenerateUseCase";

/**
 * @description 線の描画を実行（WebGL版と同じ仕様）
 *              Execute stroke rendering (same specification as WebGL)
 *
 * @param {GPUDevice} device
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {BufferManager} bufferManager
 * @param {PipelineManager} pipelineManager
 * @param {IPath[]} vertices - パス配列 [x, y, isCurve, ...]
 * @param {number} thickness - 線の太さ（フル値、内部で/2される）
 * @param {Float32Array} contextMatrix - コンテキストの変換行列
 * @param {Float32Array} strokeStyle - 線スタイル [r, g, b, a]
 * @param {number} globalAlpha - グローバルアルファ値
 * @param {number} viewportWidth - ビューポート幅
 * @param {number} viewportHeight - ビューポート高さ
 * @param {boolean} useAtlasTarget - アトラスターゲットを使用するかどうか
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    render_pass_encoder: GPURenderPassEncoder,
    buffer_manager: BufferManager,
    pipeline_manager: PipelineManager,
    vertices: IPath[],
    thickness: number,
    context_matrix: Float32Array,
    stroke_style: Float32Array,
    global_alpha: number,
    viewport_width: number,
    viewport_height: number,
    use_atlas_target: boolean
): void => {
    if (!vertices.length) {
        return;
    }

    // ストロークメッシュを生成（WebGL版と同じ: 内部でthickness/2される）
    const meshVertices = generateStrokeMesh(vertices, thickness);

    if (meshVertices.length === 0) { return }

    // 頂点バッファを取得（プールから再利用）
    const vertexBuffer = buffer_manager.acquireVertexBuffer(meshVertices.byteLength, meshVertices);

    // WebGL版と同じ: 行列をビューポートサイズで正規化
    const a  = context_matrix[0];
    const b  = context_matrix[1];
    const c  = context_matrix[3];
    const d  = context_matrix[4];
    const tx = context_matrix[6];
    const ty = context_matrix[7];

    const normalizedA  = a / viewport_width;
    const normalizedB  = b / viewport_height;
    const normalizedC  = c / viewport_width;
    const normalizedD  = d / viewport_height;
    const normalizedTx = tx / viewport_width;
    const normalizedTy = ty / viewport_height;

    // Uniformバッファを作成（WGSLのアライメントに合わせる）
    // mat3x3<f32>は各列がvec4にパディングされる: 3 x vec4 = 48 bytes (12 floats)
    // color: vec4<f32> = 16 bytes (4 floats)
    // alpha: f32 + padding = 16 bytes (4 floats)
    // 合計: 80 bytes (20 floats)
    const uniformData = new Float32Array(20);
    // matrix column 0 (vec4 padded) - 正規化された行列
    uniformData[0] = normalizedA;
    uniformData[1] = normalizedB;
    uniformData[2] = 0;
    uniformData[3] = 0; // padding
    // matrix column 1 (vec4 padded)
    uniformData[4] = normalizedC;
    uniformData[5] = normalizedD;
    uniformData[6] = 0;
    uniformData[7] = 0; // padding
    // matrix column 2 (vec4 padded)
    uniformData[8] = normalizedTx;
    uniformData[9] = normalizedTy;
    uniformData[10] = 1;
    uniformData[11] = 0; // padding
    // color (vec4)
    uniformData[12] = stroke_style[0];
    uniformData[13] = stroke_style[1];
    uniformData[14] = stroke_style[2];
    uniformData[15] = stroke_style[3];
    // alpha + padding
    uniformData[16] = global_alpha;
    uniformData[17] = 0; // padding
    uniformData[18] = 0; // padding
    uniformData[19] = 0; // padding

    const uniformBuffer = buffer_manager.acquireUniformBuffer(uniformData.byteLength);
    device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    // バインドグループを作成
    const bindGroupLayout = pipeline_manager.getBindGroupLayout("basic");
    if (!bindGroupLayout) {
        console.error("[WebGPU] Basic bind group layout not found");
        return;
    }

    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [{
            "binding": 0,
            "resource": { "buffer": uniformBuffer }
        }]
    });

    // パイプラインを取得して描画（アトラス用かキャンバス用かで切り替え）
    const pipelineName = use_atlas_target ? "basic" : "basic_bgra";
    const pipeline = pipeline_manager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        return;
    }

    render_pass_encoder.setPipeline(pipeline);
    render_pass_encoder.setVertexBuffer(0, vertexBuffer);
    render_pass_encoder.setBindGroup(0, bindGroup);
    render_pass_encoder.draw(meshVertices.length / 4, 1, 0, 0);
};
