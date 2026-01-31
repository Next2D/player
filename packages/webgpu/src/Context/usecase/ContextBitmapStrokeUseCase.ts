import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshBitmapStrokeGenerateUseCase } from "../../Mesh/usecase/MeshBitmapStrokeGenerateUseCase";
import { execute as contextComputeBitmapMatrixService } from "../service/ContextComputeBitmapMatrixService";

/**
 * @description ビットマップ線の描画を実行（WebGL版と同じ仕様）
 *              Execute bitmap stroke (same specification as WebGL)
 *
 * @param {GPUDevice} device
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {BufferManager} bufferManager
 * @param {PipelineManager} pipelineManager
 * @param {IPath[]} vertices - パス配列 [x, y, isCurve, ...]
 * @param {number} thickness - 線の太さ（フル値、内部で/2される）
 * @param {Float32Array} contextMatrix - コンテキストの変換行列
 * @param {Float32Array} strokeStyle - 線スタイル [r, g, b, a]
 * @param {Uint8Array} pixels - ピクセルデータ
 * @param {Float32Array} bitmapMatrix - ビットマップ変換行列 [a, b, c, d, tx, ty]
 * @param {number} width - ビットマップ幅
 * @param {number} height - ビットマップ高さ
 * @param {boolean} repeat - 繰り返し
 * @param {boolean} smooth - スムージング
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @param {boolean} useAtlasTarget - アトラスターゲットを使用するかどうか
 * @return {GPUTexture | null} - ビットマップテクスチャ（フレーム終了時に解放が必要）
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
    pixels: Uint8Array,
    bitmap_matrix: Float32Array,
    width: number,
    height: number,
    repeat: boolean,
    smooth: boolean,
    viewport_width: number,
    viewport_height: number,
    use_atlas_target: boolean
): GPUTexture | null => {
    // 色（ビットマップ描画ではアルファ乗算用に使用）
    const red = stroke_style[0];
    const green = stroke_style[1];
    const blue = stroke_style[2];
    const alpha = stroke_style[3];

    // 行列を取得
    const a  = context_matrix[0];
    const b  = context_matrix[1];
    const c  = context_matrix[3];
    const d  = context_matrix[4];
    const tx = context_matrix[6];
    const ty = context_matrix[7];

    // ビットマップストローク用メッシュを生成
    const mesh = meshBitmapStrokeGenerateUseCase(
        vertices,
        thickness,
        a, b, c, d, tx, ty,
        red, green, blue, alpha,
        viewport_width, viewport_height
    );

    if (mesh.indexCount === 0) {
        return null;
    }

    // 頂点バッファを取得（プールから再利用）
    const vertexBuffer = buffer_manager.acquireVertexBuffer(mesh.buffer.byteLength, mesh.buffer);

    // ビットマップテクスチャを作成
    const bitmapTexture = device.createTexture({
        "size": { width, height },
        "format": "rgba8unorm",
        "usage": GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
    });

    // ピクセルデータをテクスチャに転送
    device.queue.writeTexture(
        { "texture": bitmapTexture },
        pixels.buffer,
        { "bytesPerRow": width * 4, "rowsPerImage": height, "offset": pixels.byteOffset },
        { width, height }
    );

    // ビットマップ変換行列を計算（逆行列）
    const computedBitmapMatrix = contextComputeBitmapMatrixService(bitmap_matrix);

    // Uniformバッファを作成
    const uniformData = new Float32Array(16);
    // mat3x3 (WGSL column-major: 各列がvec4にパディング)
    // computedBitmapMatrixは行優先で格納されているため、列優先に変換
    // Row-major: [row0: a,b,0] [row1: c,d,0] [row2: tx,ty,1]
    // Column-major: [col0: a,c,tx] [col1: b,d,ty] [col2: 0,0,1]
    uniformData[0] = computedBitmapMatrix[0];  // column 0, row 0 (a)
    uniformData[1] = computedBitmapMatrix[3];  // column 0, row 1 (c)
    uniformData[2] = computedBitmapMatrix[6];  // column 0, row 2 (tx)
    uniformData[3] = 0; // padding
    uniformData[4] = computedBitmapMatrix[1];  // column 1, row 0 (b)
    uniformData[5] = computedBitmapMatrix[4];  // column 1, row 1 (d)
    uniformData[6] = computedBitmapMatrix[7];  // column 1, row 2 (ty)
    uniformData[7] = 0; // padding
    uniformData[8] = computedBitmapMatrix[2];  // column 2, row 0 (0)
    uniformData[9] = computedBitmapMatrix[5];  // column 2, row 1 (0)
    uniformData[10] = computedBitmapMatrix[8]; // column 2, row 2 (1)
    uniformData[11] = 0; // padding
    // ビットマップパラメータ
    uniformData[12] = width;
    uniformData[13] = height;
    uniformData[14] = repeat ? 1.0 : 0.0;
    uniformData[15] = 0; // padding

    const uniformBuffer = buffer_manager.acquireUniformBuffer(uniformData.byteLength);
    device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    // サンプラーを作成
    const sampler = device.createSampler({
        "magFilter": smooth ? "linear" : "nearest",
        "minFilter": smooth ? "linear" : "nearest",
        "addressModeU": repeat ? "repeat" : "clamp-to-edge",
        "addressModeV": repeat ? "repeat" : "clamp-to-edge"
    });

    // バインドグループを作成
    const bindGroupLayout = pipeline_manager.getBindGroupLayout("bitmap_fill");
    if (!bindGroupLayout) {
        console.error("[WebGPU] bitmap_fill bind group layout not found");
        bitmapTexture.destroy();
        return null;
    }

    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [
            { "binding": 0, "resource": { "buffer": uniformBuffer } },
            { "binding": 1, "resource": sampler },
            { "binding": 2, "resource": bitmapTexture.createView() }
        ]
    });

    // パイプラインを取得（アトラス用かキャンバス用かで切り替え）
    const pipelineName = use_atlas_target ? "bitmap_fill" : "bitmap_fill_bgra";
    const pipeline = pipeline_manager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        bitmapTexture.destroy();
        return null;
    }

    // 描画
    render_pass_encoder.setPipeline(pipeline);
    render_pass_encoder.setVertexBuffer(0, vertexBuffer);
    render_pass_encoder.setBindGroup(0, bindGroup);
    render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);

    // ビットマップテクスチャを返す（Context.tsでフレーム終了時に解放）
    return bitmapTexture;
};
