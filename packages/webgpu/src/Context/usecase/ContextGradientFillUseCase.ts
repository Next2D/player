import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { generateGradientLUT, getAdaptiveResolution } from "../../Gradient/GradientLUTGenerator";
import { execute as contextComputeGradientMatrixService } from "../service/ContextComputeGradientMatrixService";
import {
    $isMaskDrawing,
    $isMaskTestEnabled,
    $getMaskStencilReference
} from "../../Mask";

/**
 * @description グラデーションの塗りつぶしを実行
 *              Execute gradient fill
 *
 * @param {GPUDevice} device
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {BufferManager} bufferManager
 * @param {PipelineManager} pipelineManager
 * @param {IPath[]} pathVertices - パス頂点
 * @param {Float32Array} contextMatrix - コンテキストの変換行列
 * @param {Float32Array} fillStyle - 塗りつぶしスタイル [r, g, b, a]
 * @param {number} type - 0: linear, 1: radial
 * @param {number[]} stops - グラデーションストップ配列 [offset, R, G, B, A, ...]
 * @param {Float32Array} gradientMatrix - グラデーション変換行列 [a, b, c, d, tx, ty]
 * @param {number} spread - スプレッドメソッド (0: reflect, 1: repeat, 2: pad)
 * @param {number} interpolation - 補間方法 (0: RGB, 1: linearRGB)
 * @param {number} focal - ラジアルグラデーションのフォーカルポイント
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @param {boolean} useAtlasTarget - アトラスターゲットを使用するかどうか
 * @param {boolean} useStencilPipeline - マスクモード時にステンシル付きパイプラインを使用
 * @param {number} clipLevel - マスク描画時のクリップレベル（1-8）
 * @return {GPUTexture | null} - LUTテクスチャ（フレーム終了時に解放が必要）
 */
export const execute = (
    device: GPUDevice,
    renderPassEncoder: GPURenderPassEncoder,
    bufferManager: BufferManager,
    pipelineManager: PipelineManager,
    pathVertices: IPath[],
    contextMatrix: Float32Array,
    fillStyle: Float32Array,
    type: number,
    stops: number[],
    gradientMatrix: Float32Array,
    spread: number,
    interpolation: number,
    focal: number,
    viewportWidth: number,
    viewportHeight: number,
    useAtlasTarget: boolean,
    useStencilPipeline: boolean = false,
    clipLevel: number = 1
): GPUTexture | null => {
    // 色（グラデーション描画ではアルファ乗算用に使用）
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
        `gradient_fill_${Date.now()}`,
        mesh.buffer
    );

    // グラデーションLUTテクスチャを生成
    const lutData = generateGradientLUT(stops, spread, interpolation);
    const stopsLength = stops.length / 5;
    const lutResolution = getAdaptiveResolution(stopsLength);

    // LUTテクスチャを作成
    const lutTexture = device.createTexture({
        "size": { "width": lutResolution, "height": 1 },
        "format": "rgba8unorm",
        "usage": GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
    });

    // LUTデータをテクスチャに転送
    device.queue.writeTexture(
        { "texture": lutTexture },
        lutData.buffer,
        { "bytesPerRow": lutResolution * 4, "rowsPerImage": 1, "offset": lutData.byteOffset },
        { "width": lutResolution, "height": 1 }
    );

    // WebGL版と同じ計算でグラデーション変換データを取得
    const gradientData = contextComputeGradientMatrixService(gradientMatrix, contextMatrix, type);

    // Uniformバッファを作成
    // GradientUniforms構造体:
    // - inverseMatrix: mat3x3<f32> (各列がvec4にパディング = 48 bytes)
    // - gradientType: f32 (4 bytes)
    // - focal: f32 (4 bytes)
    // - spread: f32 (4 bytes)
    // - radius: f32 (4 bytes)
    // - linearPoints: vec4<f32> (16 bytes) - a.x, a.y, b.x, b.y
    // 合計: 80 bytes
    const uniformData = new Float32Array(20);
    // mat3x3 (WGSL column-major: 各列がvec4にパディング)
    // inverseMatrixは行優先で格納されているため、列優先に変換
    // Row-major: [row0: a,b,0] [row1: c,d,0] [row2: tx,ty,1]
    // Column-major: [col0: a,c,tx] [col1: b,d,ty] [col2: 0,0,1]
    uniformData[0] = gradientData.inverseMatrix[0];  // column 0, row 0 (a)
    uniformData[1] = gradientData.inverseMatrix[3];  // column 0, row 1 (c)
    uniformData[2] = gradientData.inverseMatrix[6];  // column 0, row 2 (tx)
    uniformData[3] = 0; // padding
    uniformData[4] = gradientData.inverseMatrix[1];  // column 1, row 0 (b)
    uniformData[5] = gradientData.inverseMatrix[4];  // column 1, row 1 (d)
    uniformData[6] = gradientData.inverseMatrix[7];  // column 1, row 2 (ty)
    uniformData[7] = 0; // padding
    uniformData[8] = gradientData.inverseMatrix[2];  // column 2, row 0 (0)
    uniformData[9] = gradientData.inverseMatrix[5];  // column 2, row 1 (0)
    uniformData[10] = gradientData.inverseMatrix[8]; // column 2, row 2 (1)
    uniformData[11] = 0; // padding
    // グラデーションパラメータ
    uniformData[12] = type; // gradientType
    // focal point ratio を -0.975 ~ 0.975 にclamp（WebGL版と同じ）
    uniformData[13] = Math.max(-0.975, Math.min(0.975, focal)); // focal
    uniformData[14] = spread; // spread (0: reflect, 1: repeat, 2: pad)
    uniformData[15] = 819.2; // radius（Radial用、WebGL版と同じ定数）
    // Linear用の点a, b
    if (gradientData.linearPoints) {
        uniformData[16] = gradientData.linearPoints[0]; // a.x
        uniformData[17] = gradientData.linearPoints[1]; // a.y
        uniformData[18] = gradientData.linearPoints[2]; // b.x
        uniformData[19] = gradientData.linearPoints[3]; // b.y
    } else {
        uniformData[16] = 0;
        uniformData[17] = 0;
        uniformData[18] = 0;
        uniformData[19] = 0;
    }

    const uniformBuffer = bufferManager.createUniformBuffer(
        `gradient_uniform_${Date.now()}`,
        uniformData.byteLength
    );
    device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    // サンプラーを作成
    const sampler = device.createSampler({
        "magFilter": "linear",
        "minFilter": "linear",
        "addressModeU": "clamp-to-edge",
        "addressModeV": "clamp-to-edge"
    });

    // バインドグループを作成
    const bindGroupLayout = pipelineManager.getBindGroupLayout("gradient_fill");
    if (!bindGroupLayout) {
        console.error("[WebGPU] gradient_fill bind group layout not found");
        lutTexture.destroy();
        return null;
    }

    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [
            { "binding": 0, "resource": { "buffer": uniformBuffer } },
            { "binding": 1, "resource": sampler },
            { "binding": 2, "resource": lutTexture.createView() }
        ]
    });

    // アトラス描画時は2パスステンシル処理を使用（WebGL版と同じ）
    // Pass 1: ステンシルに書き込み
    // Pass 2: グラデーションを描画（NOT_EQUAL 0またはマスクテスト）
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

        // === Pass 2: グラデーション描画（NOT_EQUAL 0） ===
        let gradientPipelineName: string;
        if (isMasked) {
            // マスクモード: stencil > maskValue の部分のみ描画
            gradientPipelineName = "gradient_fill_stencil_masked";
        } else {
            // 通常モード: stencil != 0 の部分に描画
            gradientPipelineName = "gradient_fill_stencil";
        }

        let gradientPipeline = pipelineManager.getPipeline(gradientPipelineName);
        if (!gradientPipeline) {
            // フォールバック: gradient_fill_stencilを使用
            gradientPipeline = pipelineManager.getPipeline("gradient_fill_stencil");
        }

        if (gradientPipeline) {
            renderPassEncoder.setPipeline(gradientPipeline);
            renderPassEncoder.setStencilReference(isMasked ? maskReference : 0);
            renderPassEncoder.setVertexBuffer(0, vertexBuffer);
            renderPassEncoder.setBindGroup(0, bindGroup);
            renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);
        }
    } else {
        // パイプラインを取得
        // - アトラス用: "gradient_fill" (rgba8unorm, ステンシルなし)
        // - キャンバス用: "gradient_fill_bgra" (bgra8unorm, ステンシルなし)
        // - マスク描画モード時: "clip_write_main_N" (ステンシル書き込み、カラー書き込みなし)
        // - マスクテストモード時: "gradient_fill_bgra_stencil" (bgra8unorm, ステンシルテストあり)
        let pipelineName: string;
        if (useAtlasTarget) {
            pipelineName = "gradient_fill";
        } else if (useStencilPipeline) {
            if ($isMaskDrawing()) {
                // マスク描画モード: ステンシルにシェイプを書き込み、グラデーションは描画しない
                // WebGL版: stencilOp(ZERO, INVERT, INVERT), colorMask(false, false, false, false)
                const clampedLevel = Math.min(8, Math.max(1, clipLevel));
                pipelineName = `clip_write_main_${clampedLevel}`;

                const pipeline = pipelineManager.getPipeline(pipelineName);
                if (!pipeline) {
                    console.error(`[WebGPU] ${pipelineName} pipeline not found`);
                    lutTexture.destroy();
                    return null;
                }

                // ステンシルのみ書き込み（グラデーションは描画しない）
                renderPassEncoder.setPipeline(pipeline);
                renderPassEncoder.setStencilReference(0);
                renderPassEncoder.setVertexBuffer(0, vertexBuffer);
                renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);

                return lutTexture;
            }
            // マスクテストモード: ステンシル値をテストしてグラデーションを描画
            pipelineName = "gradient_fill_bgra_stencil";

        } else {
            pipelineName = "gradient_fill_bgra";
        }
        const pipeline = pipelineManager.getPipeline(pipelineName);
        if (!pipeline) {
            console.error(`[WebGPU] ${pipelineName} pipeline not found`);
            lutTexture.destroy();
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

    // LUTテクスチャを返す（Context.tsでフレーム終了時に解放）
    return lutTexture;
};
