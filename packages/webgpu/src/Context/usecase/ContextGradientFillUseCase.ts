import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { generateGradientLUT, getAdaptiveResolution } from "../../Gradient/GradientLUTGenerator";
import { execute as contextComputeGradientMatrixService } from "../service/ContextComputeGradientMatrixService";
import { $getLUTFromCache, $putLUTToCache } from "../../Gradient/GradientLUTCache";
import { $acquireFillTexture } from "../../FillTexturePool";
import {
    $isMaskDrawing,
    $getMaskStencilReference
} from "../../Mask";

let $gradientSampler: GPUSampler | null = null;

const $uniformData36 = new Float32Array(36);

const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];

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
    // MeshFillGenerateUseCaseで頂点データを生成（4 floats/vertex: position + bezier）
    const mesh = meshFillGenerateUseCase(path_vertices);

    if (mesh.indexCount === 0) {
        return null;
    }

    // 頂点バッファを取得（プールから再利用）
    const vertexBuffer = buffer_manager.acquireVertexBuffer(mesh.buffer.byteLength, mesh.buffer);

    // グラデーションLUTテクスチャを取得（キャッシュ優先）
    let lutTexture: GPUTexture;
    let lutView: GPUTextureView;

    const cachedLUT = $getLUTFromCache(stops, spread, interpolation);
    if (cachedLUT) {
        lutTexture = cachedLUT.texture;
        lutView = cachedLUT.view;
    } else {
        const lutData = generateGradientLUT(stops, spread, interpolation);
        const stopsLength = stops.length / 5;
        const lutResolution = getAdaptiveResolution(stopsLength);

        lutTexture = $acquireFillTexture(device, lutResolution, 1);

        device.queue.writeTexture(
            { "texture": lutTexture },
            lutData,
            { "bytesPerRow": lutResolution * 4, "rowsPerImage": 1 },
            { "width": lutResolution, "height": 1 }
        );

        lutView = lutTexture.createView();
        $putLUTToCache(stops, spread, interpolation, lutTexture, lutView);
    }

    // WebGL版と同じ計算でグラデーション変換データを取得
    const gradientData = contextComputeGradientMatrixService(gradient_matrix, context_matrix, type);

    // グラデーション描画では色は白（1, 1, 1, alpha）を使用
    const alpha = fill_style[3] > 0 ? fill_style[3] : 1;

    // 行列を取得
    const a  = context_matrix[0];
    const b  = context_matrix[1];
    const c  = context_matrix[3];
    const d  = context_matrix[4];
    const tx = context_matrix[6];
    const ty = context_matrix[7];

    // Uniformバッファを作成
    // GradientUniforms構造体:
    // - inverseMatrix: mat3x3<f32> (各列がvec4にパディング = 48 bytes)
    // - gradientType, focal, spread, radius (16 bytes)
    // - linearPoints: vec4<f32> (16 bytes)
    // - color: vec4<f32> (16 bytes)
    // - contextMatrix0/1/2: vec4<f32> x3 (48 bytes)
    // 合計: 144 bytes = 36 floats → 使用する配列は32 floats（パディング込み）
    $uniformData36[0] = gradientData.inverseMatrix[0];  // column 0, row 0 (a)
    $uniformData36[1] = gradientData.inverseMatrix[3];  // column 0, row 1 (c)
    $uniformData36[2] = 0;                              // column 0, row 2 (0)
    $uniformData36[3] = 0; // padding
    $uniformData36[4] = gradientData.inverseMatrix[1];  // column 1, row 0 (b)
    $uniformData36[5] = gradientData.inverseMatrix[4];  // column 1, row 1 (d)
    $uniformData36[6] = 0;                              // column 1, row 2 (0)
    $uniformData36[7] = 0; // padding
    $uniformData36[8] = gradientData.inverseMatrix[6];  // column 2, row 0 (tx)
    $uniformData36[9] = gradientData.inverseMatrix[7];  // column 2, row 1 (ty)
    $uniformData36[10] = 1;                             // column 2, row 2 (1)
    $uniformData36[11] = 0; // padding
    // グラデーションパラメータ
    $uniformData36[12] = type; // gradientType
    $uniformData36[13] = Math.max(-0.975, Math.min(0.975, focal)); // focal
    $uniformData36[14] = spread; // spread (0: reflect, 1: repeat, 2: pad)
    $uniformData36[15] = 819.2; // radius（Radial用、WebGL版と同じ定数）
    // Linear用の点a, b
    if (gradientData.linearPoints) {
        $uniformData36[16] = gradientData.linearPoints[0]; // a.x
        $uniformData36[17] = gradientData.linearPoints[1]; // a.y
        $uniformData36[18] = gradientData.linearPoints[2]; // b.x
        $uniformData36[19] = gradientData.linearPoints[3]; // b.y
    } else {
        $uniformData36[16] = 0;
        $uniformData36[17] = 0;
        $uniformData36[18] = 0;
        $uniformData36[19] = 0;
    }
    // color (白 + alpha)
    $uniformData36[20] = 1; // red
    $uniformData36[21] = 1; // green
    $uniformData36[22] = 1; // blue
    $uniformData36[23] = alpha;
    // contextMatrix（viewport正規化済み）
    $uniformData36[24] = a / viewport_width;
    $uniformData36[25] = b / viewport_height;
    $uniformData36[26] = 0;
    $uniformData36[27] = 0;
    $uniformData36[28] = c / viewport_width;
    $uniformData36[29] = d / viewport_height;
    $uniformData36[30] = 0;
    $uniformData36[31] = 0;
    // contextMatrix2
    $uniformData36[32] = tx / viewport_width;
    $uniformData36[33] = ty / viewport_height;
    $uniformData36[34] = 1;
    $uniformData36[35] = 0;

    const uniformBuffer = buffer_manager.acquireUniformBuffer($uniformData36.byteLength);
    device.queue.writeBuffer(uniformBuffer, 0, $uniformData36.buffer, $uniformData36.byteOffset, $uniformData36.byteLength);

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
        return null;
    }

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = lutView;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    // ステンシル書き込みパス用のFillUniforms bindGroupを作成
    // stencil_write_atlas / stencil_write_main はFillUniforms（color+matrix）を期待する
    const createStencilBindGroup = (pipelineName: string): GPUBindGroup | null => {
        const pipeline = pipeline_manager.getPipeline(pipelineName);
        if (!pipeline) {
            return null;
        }
        const stencilLayout = pipeline.getBindGroupLayout(0);
        // FillUniformsと同じレイアウト: color(16) + matrix0(16) + matrix1(16) + matrix2(16) = 64 bytes
        const stencilUniformData = new Float32Array(16);
        stencilUniformData[0] = 1; // red
        stencilUniformData[1] = 1; // green
        stencilUniformData[2] = 1; // blue
        stencilUniformData[3] = alpha;
        stencilUniformData[4] = a / viewport_width;
        stencilUniformData[5] = b / viewport_height;
        stencilUniformData[6] = 0;
        stencilUniformData[7] = 0;
        stencilUniformData[8] = c / viewport_width;
        stencilUniformData[9] = d / viewport_height;
        stencilUniformData[10] = 0;
        stencilUniformData[11] = 0;
        stencilUniformData[12] = tx / viewport_width;
        stencilUniformData[13] = ty / viewport_height;
        stencilUniformData[14] = 1;
        stencilUniformData[15] = 0;

        const stencilUniformBuffer = buffer_manager.acquireUniformBuffer(stencilUniformData.byteLength);
        device.queue.writeBuffer(stencilUniformBuffer, 0, stencilUniformData.buffer, stencilUniformData.byteOffset, stencilUniformData.byteLength);
        return device.createBindGroup({
            "layout": stencilLayout,
            "entries": [{
                "binding": 0,
                "resource": { "buffer": stencilUniformBuffer }
            }]
        });
    };

    // アトラス描画時：2パスステンシルフィル（WebGL版と同じアルゴリズム）
    // これにより中抜き描画（hollow shape）が正しく機能する
    if (use_atlas_target) {
        // === Pass 1: ステンシル書き込み ===
        const stencilWritePipeline = pipeline_manager.getPipeline("stencil_write_atlas");
        if (stencilWritePipeline) {
            const stencilBindGroup = createStencilBindGroup("stencil_write_atlas");
            render_pass_encoder.setPipeline(stencilWritePipeline);
            render_pass_encoder.setStencilReference(0);
            render_pass_encoder.setVertexBuffer(0, vertexBuffer);
            if (stencilBindGroup) {
                render_pass_encoder.setBindGroup(0, stencilBindGroup);
            }
            render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
        }

        // === Pass 2: グラデーション描画（ステンシルテスト付き） ===
        const gradientPipeline = pipeline_manager.getPipeline("gradient_fill_stencil_atlas");
        if (gradientPipeline) {
            render_pass_encoder.setPipeline(gradientPipeline);
            render_pass_encoder.setStencilReference(0);
            render_pass_encoder.setBindGroup(0, bindGroup);
            render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
        }
        return null;
    }

    // キャンバスへの直接描画
    if (use_stencil_pipeline && $isMaskDrawing()) {
        return null;
    }

    // === メインキャンバス直接描画: 2パスステンシルフィル ===

    // === Pass 1: ステンシル書き込み ===
    const stencilWritePipeline = pipeline_manager.getPipeline("stencil_write_main");
    if (stencilWritePipeline) {
        const stencilBindGroup = createStencilBindGroup("stencil_write_main");
        render_pass_encoder.setPipeline(stencilWritePipeline);
        render_pass_encoder.setStencilReference(0);
        render_pass_encoder.setVertexBuffer(0, vertexBuffer);
        if (stencilBindGroup) {
            render_pass_encoder.setBindGroup(0, stencilBindGroup);
        }
        render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
    }

    // === Pass 2: グラデーション描画（ステンシルテスト付き） ===
    const pipelineName = use_stencil_pipeline
        ? "gradient_fill_bgra_stencil_masked"
        : "gradient_fill_stencil_main";

    const gradientPipeline = pipeline_manager.getPipeline(pipelineName);
    if (gradientPipeline) {
        render_pass_encoder.setPipeline(gradientPipeline);
        render_pass_encoder.setStencilReference(use_stencil_pipeline ? $getMaskStencilReference() : 0);
        render_pass_encoder.setBindGroup(0, bindGroup);
        render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
    }

    // LUTテクスチャはキャッシュ管理
    return null;
};
