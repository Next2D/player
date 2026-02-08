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

let $gradientSampler: GPUSampler | null = null;

export const execute = (
    device: GPUDevice,
    render_pass_encoder: GPURenderPassEncoder,
    buffer_manager: BufferManager,
    pipeline_manager: PipelineManager,
    path_vertices: IPath[],
    context_matrix: Float32Array,
    fill_style: Float32Array,
    type: number,
    stops: number[],
    gradient_matrix: Float32Array,
    spread: number,
    interpolation: number,
    focal: number,
    viewport_width: number,
    viewport_height: number,
    use_atlas_target: boolean,
    use_stencil_pipeline: boolean = false,
    _clip_level: number = 1
): GPUTexture | null => {
    // グラデーション描画では色は白（1, 1, 1, 1）を使用
    // グラデーションの色はLUTテクスチャから取得される
    // fill_styleのアルファのみ乗算用に使用（globalAlpha等）
    const red = 1;
    const green = 1;
    const blue = 1;
    const alpha = fill_style[3] > 0 ? fill_style[3] : 1;

    // 行列を取得
    const a  = context_matrix[0];
    const b  = context_matrix[1];
    const c  = context_matrix[3];
    const d  = context_matrix[4];
    const tx = context_matrix[6];
    const ty = context_matrix[7];

    // MeshFillGenerateUseCaseで頂点データを生成
    const mesh = meshFillGenerateUseCase(
        path_vertices,
        a, b, c, d, tx, ty,
        red, green, blue, alpha,
        viewport_width, viewport_height
    );

    if (mesh.indexCount === 0) {
        return null;
    }

    // 頂点バッファを取得（プールから再利用）
    const vertexBuffer = buffer_manager.acquireVertexBuffer(mesh.buffer.byteLength, mesh.buffer);

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
    const gradientData = contextComputeGradientMatrixService(gradient_matrix, context_matrix, type);

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

    const uniformBuffer = buffer_manager.acquireUniformBuffer(uniformData.byteLength);
    device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    // サンプラーを作成（キャッシュ済み）
    if (!$gradientSampler) {
        $gradientSampler = device.createSampler({
            "magFilter": "linear",
            "minFilter": "linear",
            "addressModeU": "clamp-to-edge",
            "addressModeV": "clamp-to-edge"
        });
    }
    const sampler = $gradientSampler;

    // バインドグループを作成
    const bindGroupLayout = pipeline_manager.getBindGroupLayout("gradient_fill");
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
    if (use_atlas_target) {
        // === Pass 1: ステンシル書き込み ===
        // FRONT=INCR_WRAP, BACK=DECR_WRAP でステンシルに書き込み（colorMask=false）
        // 非ゼロワインディングルールにより、外側パスと内側パスの重複部分は相殺される
        const stencilWritePipeline = pipeline_manager.getPipeline("stencil_write_atlas");
        if (stencilWritePipeline) {
            render_pass_encoder.setPipeline(stencilWritePipeline);
            render_pass_encoder.setStencilReference(0);
            render_pass_encoder.setVertexBuffer(0, vertexBuffer);
            render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
        }

        // === Pass 2: グラデーション描画（ステンシルテスト付き） ===
        // ステンシル != 0 の部分にグラデーションを描画し、ステンシルをクリア
        const gradientPipeline = pipeline_manager.getPipeline("gradient_fill_stencil_atlas");
        if (gradientPipeline) {
            render_pass_encoder.setPipeline(gradientPipeline);
            render_pass_encoder.setStencilReference(0);
            render_pass_encoder.setVertexBuffer(0, vertexBuffer);
            render_pass_encoder.setBindGroup(0, bindGroup);
            render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
        }
        return lutTexture;
    }

    // キャンバスへの直接描画
    // マスク描画モード時: 何もしない（clip()でステンシル書き込み）
    if (use_stencil_pipeline && $isMaskDrawing()) {
        // マスク描画モード: ステンシルへの書き込みはclip()で行うため、ここでは何もしない
        // clip()がINVERTでステンシルを書き込み、重複書き込みによるINVERT打ち消しを防止
        // LUTテクスチャは解放してnullを返す
        lutTexture.destroy();
        return null;
    }

    // === メインキャンバス直接描画: 2パスステンシルフィル ===
    // 中抜き描画（hollow shape）を正しく処理するため

    // === Pass 1: ステンシル書き込み ===
    // FRONT=INCR_WRAP, BACK=DECR_WRAP でステンシルに書き込み（colorMask=false）
    const stencilWritePipeline = pipeline_manager.getPipeline("stencil_write_main");
    if (stencilWritePipeline) {
        render_pass_encoder.setPipeline(stencilWritePipeline);
        render_pass_encoder.setStencilReference(0);
        render_pass_encoder.setVertexBuffer(0, vertexBuffer);
        render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
    }

    // === Pass 2: グラデーション描画（ステンシルテスト付き） ===
    // ステンシル != 0 の部分にグラデーションを描画し、ステンシルをクリア
    const pipelineName = use_stencil_pipeline
        ? "gradient_fill_bgra_stencil_masked"  // マスクテスト + 中抜き
        : "gradient_fill_stencil_main";        // 中抜きのみ

    const gradientPipeline = pipeline_manager.getPipeline(pipelineName);
    if (gradientPipeline) {
        render_pass_encoder.setPipeline(gradientPipeline);
        render_pass_encoder.setStencilReference(use_stencil_pipeline ? $getMaskStencilReference() : 0);
        render_pass_encoder.setVertexBuffer(0, vertexBuffer);
        render_pass_encoder.setBindGroup(0, bindGroup);
        render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
    }

    // LUTテクスチャを返す（Context.tsでフレーム終了時に解放）
    return lutTexture;
};
