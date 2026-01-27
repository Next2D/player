import type { IPoint } from "../../interface/IPoint";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { generateStrokeMesh } from "../../Mesh/usecase/MeshStrokeGenerateUseCase";

/**
 * @description 線の描画を実行
 *              Execute stroke rendering
 *
 * @param {GPUDevice} device
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {BufferManager} bufferManager
 * @param {PipelineManager} pipelineManager
 * @param {IPoint[][]} paths - パス配列
 * @param {number} thickness - 線の太さ（半分の値）
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
    renderPassEncoder: GPURenderPassEncoder,
    bufferManager: BufferManager,
    pipelineManager: PipelineManager,
    paths: IPoint[][],
    thickness: number,
    contextMatrix: Float32Array,
    strokeStyle: Float32Array,
    globalAlpha: number,
    viewportWidth: number,
    viewportHeight: number,
    useAtlasTarget: boolean
): void => {
    // ストロークメッシュを生成
    const vertices = generateStrokeMesh(paths, thickness);

    if (vertices.length === 0) return;

    // 頂点バッファを作成
    const vertexBuffer = bufferManager.createVertexBuffer(
        `stroke_${Date.now()}`,
        vertices
    );

    // WebGL版と同じ: 行列をビューポートサイズで正規化
    const a  = contextMatrix[0];
    const b  = contextMatrix[1];
    const c  = contextMatrix[3];
    const d  = contextMatrix[4];
    const tx = contextMatrix[6];
    const ty = contextMatrix[7];

    const normalizedA  = a / viewportWidth;
    const normalizedB  = b / viewportHeight;
    const normalizedC  = c / viewportWidth;
    const normalizedD  = d / viewportHeight;
    const normalizedTx = tx / viewportWidth;
    const normalizedTy = ty / viewportHeight;

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
    uniformData[12] = strokeStyle[0];
    uniformData[13] = strokeStyle[1];
    uniformData[14] = strokeStyle[2];
    uniformData[15] = strokeStyle[3];
    // alpha + padding
    uniformData[16] = globalAlpha;
    uniformData[17] = 0; // padding
    uniformData[18] = 0; // padding
    uniformData[19] = 0; // padding

    const uniformBuffer = bufferManager.createUniformBuffer(
        `stroke_uniform_${Date.now()}`,
        uniformData.byteLength
    );
    device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    // バインドグループを作成
    const bindGroupLayout = pipelineManager.getBindGroupLayout("basic");
    if (!bindGroupLayout) {
        console.error("[WebGPU] Basic bind group layout not found");
        return;
    }

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [{
            binding: 0,
            resource: { buffer: uniformBuffer }
        }]
    });

    // パイプラインを取得して描画（アトラス用かキャンバス用かで切り替え）
    const pipelineName = useAtlasTarget ? "basic" : "basic_bgra";
    const pipeline = pipelineManager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        return;
    }

    renderPassEncoder.setPipeline(pipeline);
    renderPassEncoder.setVertexBuffer(0, vertexBuffer);
    renderPassEncoder.setBindGroup(0, bindGroup);
    renderPassEncoder.draw(vertices.length / 4, 1, 0, 0);
};
