import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { execute as contextComputeBitmapMatrixService } from "../service/ContextComputeBitmapMatrixService";

/**
 * @description ビットマップの塗りつぶしを実行
 *              Execute bitmap fill
 *
 * @param {GPUDevice} device
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {BufferManager} bufferManager
 * @param {PipelineManager} pipelineManager
 * @param {IPath[]} pathVertices - パス頂点
 * @param {Float32Array} contextMatrix - コンテキストの変換行列
 * @param {Float32Array} fillStyle - 塗りつぶしスタイル [r, g, b, a]
 * @param {Uint8Array} pixels - ピクセルデータ
 * @param {Float32Array} bitmapMatrix - ビットマップ変換行列 [a, b, c, d, tx, ty]
 * @param {number} width - ビットマップ幅
 * @param {number} height - ビットマップ高さ
 * @param {boolean} repeat - 繰り返し
 * @param {boolean} smooth - スムージング
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @param {boolean} useAtlasTarget - アトラスターゲットを使用するかどうか
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    renderPassEncoder: GPURenderPassEncoder,
    bufferManager: BufferManager,
    pipelineManager: PipelineManager,
    pathVertices: IPath[],
    contextMatrix: Float32Array,
    fillStyle: Float32Array,
    pixels: Uint8Array,
    bitmapMatrix: Float32Array,
    width: number,
    height: number,
    repeat: boolean,
    smooth: boolean,
    viewportWidth: number,
    viewportHeight: number,
    useAtlasTarget: boolean
): void => {
    // 色（ビットマップ描画ではアルファ乗算用に使用）
    const red = fillStyle[0];
    const green = fillStyle[1];
    const blue = fillStyle[2];
    const alpha = fillStyle[3];

    // 行列を取得
    const a  = contextMatrix[0];
    const b  = contextMatrix[1];
    const c  = contextMatrix[3];
    const d  = contextMatrix[4];
    const tx = contextMatrix[6];
    const ty = contextMatrix[7];

    // MeshFillGenerateUseCaseで頂点データを生成
    const mesh = meshFillGenerateUseCase(
        pathVertices,
        a, b, c, d, tx, ty,
        red, green, blue, alpha,
        viewportWidth, viewportHeight
    );

    if (mesh.indexCount === 0) {
        return;
    }

    // 頂点バッファを作成
    const vertexBuffer = bufferManager.createVertexBuffer(
        `bitmap_fill_${Date.now()}`,
        mesh.buffer
    );

    // ビットマップテクスチャを作成
    const bitmapTexture = device.createTexture({
        size: { width, height },
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
    });

    // ピクセルデータをテクスチャに転送
    device.queue.writeTexture(
        { texture: bitmapTexture },
        pixels.buffer,
        { bytesPerRow: width * 4, rowsPerImage: height, offset: pixels.byteOffset },
        { width, height }
    );

    // ビットマップ変換行列を計算（逆行列）
    const computedBitmapMatrix = contextComputeBitmapMatrixService(bitmapMatrix);

    // Uniformバッファを作成
    // BitmapUniforms構造体:
    // - bitmapMatrix: mat3x3<f32> (各列がvec4にパディング = 48 bytes)
    // - textureWidth: f32 (4 bytes)
    // - textureHeight: f32 (4 bytes)
    // - repeat: f32 (4 bytes)
    // - _pad: f32 (4 bytes)
    // 合計: 64 bytes
    const uniformData = new Float32Array(16);
    // mat3x3 (各列がvec4にパディング)
    uniformData[0] = computedBitmapMatrix[0];
    uniformData[1] = computedBitmapMatrix[1];
    uniformData[2] = computedBitmapMatrix[2];
    uniformData[3] = 0; // padding
    uniformData[4] = computedBitmapMatrix[3];
    uniformData[5] = computedBitmapMatrix[4];
    uniformData[6] = computedBitmapMatrix[5];
    uniformData[7] = 0; // padding
    uniformData[8] = computedBitmapMatrix[6];
    uniformData[9] = computedBitmapMatrix[7];
    uniformData[10] = computedBitmapMatrix[8];
    uniformData[11] = 0; // padding
    // ビットマップパラメータ
    uniformData[12] = width;
    uniformData[13] = height;
    uniformData[14] = repeat ? 1.0 : 0.0;
    uniformData[15] = 0; // padding

    const uniformBuffer = bufferManager.createUniformBuffer(
        `bitmap_uniform_${Date.now()}`,
        uniformData.byteLength
    );
    device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    // サンプラーを作成
    const sampler = device.createSampler({
        magFilter: smooth ? "linear" : "nearest",
        minFilter: smooth ? "linear" : "nearest",
        addressModeU: repeat ? "repeat" : "clamp-to-edge",
        addressModeV: repeat ? "repeat" : "clamp-to-edge"
    });

    // バインドグループを作成
    const bindGroupLayout = pipelineManager.getBindGroupLayout("bitmap_fill");
    if (!bindGroupLayout) {
        console.error("[WebGPU] bitmap_fill bind group layout not found");
        bitmapTexture.destroy();
        return;
    }

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: bitmapTexture.createView() }
        ]
    });

    // パイプラインを取得（アトラス用かキャンバス用かで切り替え）
    const pipelineName = useAtlasTarget ? "bitmap_fill" : "bitmap_fill_bgra";
    const pipeline = pipelineManager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        bitmapTexture.destroy();
        return;
    }

    // 描画
    renderPassEncoder.setPipeline(pipeline);
    renderPassEncoder.setVertexBuffer(0, vertexBuffer);
    renderPassEncoder.setBindGroup(0, bindGroup);
    renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);
};
