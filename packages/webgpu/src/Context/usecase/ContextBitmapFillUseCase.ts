import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { execute as contextComputeBitmapMatrixService } from "../service/ContextComputeBitmapMatrixService";
import {
    $isMaskDrawing,
    $isMaskTestEnabled,
    $getMaskStencilReference
} from "../../Mask";

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
 * @param {boolean} useStencilPipeline - マスクモード時にステンシル付きパイプラインを使用
 * @param {number} clipLevel - マスク描画時のクリップレベル（1-8）
 * @return {GPUTexture | null} - ビットマップテクスチャ（フレーム終了時に解放が必要）
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
    useAtlasTarget: boolean,
    useStencilPipeline: boolean = false,
    clipLevel: number = 1
): GPUTexture | null => {
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
        return null;
    }

    // 頂点バッファを作成
    const vertexBuffer = bufferManager.createVertexBuffer(
        `bitmap_fill_${Date.now()}`,
        mesh.buffer
    );

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

    const uniformBuffer = bufferManager.createUniformBuffer(
        `bitmap_uniform_${Date.now()}`,
        uniformData.byteLength
    );
    device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    // サンプラーを作成
    const sampler = device.createSampler({
        "magFilter": smooth ? "linear" : "nearest",
        "minFilter": smooth ? "linear" : "nearest",
        "addressModeU": repeat ? "repeat" : "clamp-to-edge",
        "addressModeV": repeat ? "repeat" : "clamp-to-edge"
    });

    // バインドグループを作成
    const bindGroupLayout = pipelineManager.getBindGroupLayout("bitmap_fill");
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

    // アトラス描画時は2パスステンシル処理を使用（WebGL版と同じ）
    // Pass 1: ステンシルに書き込み
    // Pass 2: ビットマップを描画（NOT_EQUAL 0またはマスクテスト）
    if (useAtlasTarget && useStencilPipeline) {
        const isMasked = $isMaskTestEnabled();
        const maskReference = $getMaskStencilReference();

        // === Pass 1: ステンシル書き込み（カラー書き込みなし） ===
        // Front面: INCR_WRAP, Back面: DECR_WRAP
        const stencilWritePipeline = pipelineManager.getPipeline("stencil_write");
        if (stencilWritePipeline) {
            renderPassEncoder.setPipeline(stencilWritePipeline);
            renderPassEncoder.setStencilReference(0);
            renderPassEncoder.setVertexBuffer(0, vertexBuffer);
            renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);
        }

        // === Pass 2: ビットマップ描画（NOT_EQUAL 0） ===
        let bitmapPipelineName: string;
        if (isMasked) {
            // マスクモード: stencil > maskValue の部分のみ描画
            bitmapPipelineName = "bitmap_fill_stencil_masked";
        } else {
            // 通常モード: stencil != 0 の部分に描画
            bitmapPipelineName = "bitmap_fill_stencil";
        }

        let bitmapPipeline = pipelineManager.getPipeline(bitmapPipelineName);
        if (!bitmapPipeline) {
            // フォールバック: bitmap_fill_stencilを使用
            bitmapPipeline = pipelineManager.getPipeline("bitmap_fill_stencil");
        }

        if (bitmapPipeline) {
            renderPassEncoder.setPipeline(bitmapPipeline);
            renderPassEncoder.setStencilReference(isMasked ? maskReference : 0);
            renderPassEncoder.setVertexBuffer(0, vertexBuffer);
            renderPassEncoder.setBindGroup(0, bindGroup);
            renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);
        }
    } else {
        // パイプラインを取得
        // - アトラス用: "bitmap_fill" (rgba8unorm, ステンシルなし)
        // - キャンバス用: "bitmap_fill_bgra" (bgra8unorm, ステンシルなし)
        // - マスク描画モード時: "clip_write_main_N" (ステンシル書き込み、カラー書き込みなし)
        // - マスクテストモード時: "bitmap_fill_bgra_stencil" (bgra8unorm, ステンシルテストあり)
        let pipelineName: string;
        if (useAtlasTarget) {
            pipelineName = "bitmap_fill";
        } else if (useStencilPipeline) {
            if ($isMaskDrawing()) {
                // マスク描画モード: ステンシルにシェイプを書き込み、ビットマップは描画しない
                // WebGL版: stencilOp(ZERO, INVERT, INVERT), colorMask(false, false, false, false)
                const clampedLevel = Math.min(8, Math.max(1, clipLevel));
                pipelineName = `clip_write_main_${clampedLevel}`;

                const pipeline = pipelineManager.getPipeline(pipelineName);
                if (!pipeline) {
                    console.error(`[WebGPU] ${pipelineName} pipeline not found`);
                    bitmapTexture.destroy();
                    return null;
                }

                // ステンシルのみ書き込み（ビットマップは描画しない）
                renderPassEncoder.setPipeline(pipeline);
                renderPassEncoder.setStencilReference(0);
                renderPassEncoder.setVertexBuffer(0, vertexBuffer);
                renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);

                return bitmapTexture;
            }
            // マスクテストモード: ステンシル値をテストしてビットマップを描画
            pipelineName = "bitmap_fill_bgra_stencil";

        } else {
            pipelineName = "bitmap_fill_bgra";
        }
        const pipeline = pipelineManager.getPipeline(pipelineName);
        if (!pipeline) {
            console.error(`[WebGPU] ${pipelineName} pipeline not found`);
            bitmapTexture.destroy();
            return null;
        }

        // 描画
        renderPassEncoder.setPipeline(pipeline);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        renderPassEncoder.setBindGroup(0, bindGroup);

        // マスクテストモード時はステンシル参照値を設定
        if (useStencilPipeline && !useAtlasTarget && !$isMaskDrawing()) {
            renderPassEncoder.setStencilReference($getMaskStencilReference());
        }

        renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);
    }

    // ビットマップテクスチャを返す（Context.tsでフレーム終了時に解放）
    return bitmapTexture;
};
