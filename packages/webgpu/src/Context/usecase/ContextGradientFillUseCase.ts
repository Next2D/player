import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { generateGradientLUT, getAdaptiveResolution } from "../../Gradient/GradientLUTGenerator";
import { execute as contextComputeGradientMatrixService } from "../service/ContextComputeGradientMatrixService";
import {
    $isMaskDrawing,
    $getMaskStencilReference
} from "../../Mask";
import { isDebugEnabled, logGradient, logUniformBuffer } from "../../Debug/DebugLogger";

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
    _clipLevel: number = 1
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
    // Note: Use lutData directly instead of lutData.buffer to avoid potential issues
    device.queue.writeTexture(
        { "texture": lutTexture },
        lutData,
        { "bytesPerRow": lutResolution * 4, "rowsPerImage": 1 },
        { "width": lutResolution, "height": 1 }
    );

    // WebGL版と同じ計算でグラデーション変換データを取得
    const gradientData = contextComputeGradientMatrixService(gradientMatrix, contextMatrix, type);

    // デバッグ出力: グラデーション情報
    if (isDebugEnabled()) {
        logGradient("ContextGradientFillUseCase execute", {
            type,
            stops,
            gradientMatrix,
            contextMatrix,
            "inverseMatrix": gradientData.inverseMatrix,
            "linearPoints": gradientData.linearPoints,
            spread,
            focal
        });
    }

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
    // inverseMatrixは行優先で格納されている: [a,b,0, c,d,0, tx,ty,1]
    // WGSL mat3x3 * vec3(x,y,1) で正しいaffine変換を行うための列優先形式:
    // col0: [a, c, 0]
    // col1: [b, d, 0]
    // col2: [tx, ty, 1]
    // 結果: x' = a*x + b*y + tx, y' = c*x + d*y + ty
    uniformData[0] = gradientData.inverseMatrix[0];  // column 0, row 0 (a)
    uniformData[1] = gradientData.inverseMatrix[3];  // column 0, row 1 (c)
    uniformData[2] = 0;                              // column 0, row 2 (0)
    uniformData[3] = 0; // padding
    uniformData[4] = gradientData.inverseMatrix[1];  // column 1, row 0 (b)
    uniformData[5] = gradientData.inverseMatrix[4];  // column 1, row 1 (d)
    uniformData[6] = 0;                              // column 1, row 2 (0)
    uniformData[7] = 0; // padding
    uniformData[8] = gradientData.inverseMatrix[6];  // column 2, row 0 (tx)
    uniformData[9] = gradientData.inverseMatrix[7];  // column 2, row 1 (ty)
    uniformData[10] = 1;                             // column 2, row 2 (1)
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

    // デバッグ出力: Uniformバッファの内容
    if (isDebugEnabled()) {
        logUniformBuffer("Gradient Uniform Buffer", uniformData);
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

    // アトラス描画時：2パスステンシルフィル（WebGL版と同じアルゴリズム）
    // これにより中抜き描画（hollow shape）が正しく機能する
    if (useAtlasTarget) {
        // === Pass 1: ステンシル書き込み ===
        // FRONT=INCR_WRAP, BACK=DECR_WRAP でステンシルに書き込み（colorMask=false）
        // 非ゼロワインディングルールにより、外側パスと内側パスの重複部分は相殺される
        const stencilWritePipeline = pipelineManager.getPipeline("stencil_write_atlas");
        if (stencilWritePipeline) {
            renderPassEncoder.setPipeline(stencilWritePipeline);
            renderPassEncoder.setStencilReference(0);
            renderPassEncoder.setVertexBuffer(0, vertexBuffer);
            renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);
        }

        // === Pass 2: グラデーション描画（ステンシルテスト付き） ===
        // ステンシル != 0 の部分にグラデーションを描画し、ステンシルをクリア
        const gradientPipeline = pipelineManager.getPipeline("gradient_fill_stencil_atlas");
        if (gradientPipeline) {
            renderPassEncoder.setPipeline(gradientPipeline);
            renderPassEncoder.setStencilReference(0);
            renderPassEncoder.setVertexBuffer(0, vertexBuffer);
            renderPassEncoder.setBindGroup(0, bindGroup);
            renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);
        }
        return lutTexture;
    }

    // キャンバスへの直接描画
    // - キャンバス用: "gradient_fill_bgra_no_msaa" (bgra8unorm, ステンシルなし)
    // - マスク描画モード時: 何もしない（clip()でステンシル書き込み）
    // - マスクテストモード時: "gradient_fill_bgra_stencil" (bgra8unorm, ステンシルテストあり)
    let pipelineName: string;
    if (useStencilPipeline) {
        if ($isMaskDrawing()) {
            // マスク描画モード: ステンシルへの書き込みはclip()で行うため、ここでは何もしない
            // clip()がINVERTでステンシルを書き込み、重複書き込みによるINVERT打ち消しを防止
            // LUTテクスチャは解放してnullを返す
            lutTexture.destroy();
            return null;
        }
        // マスクテストモード: ステンシル値をテストしてグラデーションを描画
        pipelineName = "gradient_fill_bgra_stencil";
    } else {
        pipelineName = "gradient_fill_bgra_no_msaa";
    }

    const pipeline = pipelineManager.getPipeline(pipelineName);
    if (!pipeline) {
        lutTexture.destroy();
        return null;
    }

    // 描画
    renderPassEncoder.setPipeline(pipeline);
    renderPassEncoder.setVertexBuffer(0, vertexBuffer);
    renderPassEncoder.setBindGroup(0, bindGroup);

    // マスクテストモード時はステンシル参照値を設定
    if (useStencilPipeline && !$isMaskDrawing()) {
        renderPassEncoder.setStencilReference($getMaskStencilReference());
    }

    renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);

    // LUTテクスチャを返す（Context.tsでフレーム終了時に解放）
    return lutTexture;
};
