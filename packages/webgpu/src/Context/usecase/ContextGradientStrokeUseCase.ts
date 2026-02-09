import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshGradientStrokeGenerateUseCase } from "../../Mesh/usecase/MeshGradientStrokeGenerateUseCase";
import { generateGradientLUT, getAdaptiveResolution } from "../../Gradient/GradientLUTGenerator";
import { execute as contextComputeGradientMatrixService } from "../service/ContextComputeGradientMatrixService";
import { $acquireFillTexture, $releaseFillTexture } from "../../FillTexturePool";

let $gradientSampler: GPUSampler | null = null;

const $uniformData20 = new Float32Array(20);

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
    vertices: IPath[],
    thickness: number,
    context_matrix: Float32Array,
    stroke_style: Float32Array,
    type: number,
    stops: number[],
    gradient_matrix: Float32Array,
    spread: number,
    interpolation: number,
    focal: number,
    viewport_width: number,
    viewport_height: number,
    use_atlas_target: boolean,
    use_stencil_pipeline: boolean
): GPUTexture | null => {
    // グラデーション描画では色は白（1, 1, 1, alpha）を使用
    // グラデーションの色はLUTテクスチャから取得され、頂点色で乗算される
    // そのため頂点色は白にして、アルファのみstroke_styleから使用
    const red = 1;
    const green = 1;
    const blue = 1;
    const alpha = stroke_style[3] > 0 ? stroke_style[3] : 1;

    // 行列を取得
    const a  = context_matrix[0];
    const b  = context_matrix[1];
    const c  = context_matrix[3];
    const d  = context_matrix[4];
    const tx = context_matrix[6];
    const ty = context_matrix[7];

    // グラデーションストローク用メッシュを生成
    const mesh = meshGradientStrokeGenerateUseCase(
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

    // グラデーションLUTテクスチャを生成
    const lutData = generateGradientLUT(stops, spread, interpolation);
    const stopsLength = stops.length / 5;
    const lutResolution = getAdaptiveResolution(stopsLength);

    // LUTテクスチャをプールから取得
    const lutTexture = $acquireFillTexture(device, lutResolution, 1);

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
    $uniformData20[0] = gradientData.inverseMatrix[0];  // column 0, row 0 (a)
    $uniformData20[1] = gradientData.inverseMatrix[3];  // column 0, row 1 (c)
    $uniformData20[2] = 0;                              // column 0, row 2 (0)
    $uniformData20[3] = 0; // padding
    $uniformData20[4] = gradientData.inverseMatrix[1];  // column 1, row 0 (b)
    $uniformData20[5] = gradientData.inverseMatrix[4];  // column 1, row 1 (d)
    $uniformData20[6] = 0;                              // column 1, row 2 (0)
    $uniformData20[7] = 0; // padding
    $uniformData20[8] = gradientData.inverseMatrix[6];  // column 2, row 0 (tx)
    $uniformData20[9] = gradientData.inverseMatrix[7];  // column 2, row 1 (ty)
    $uniformData20[10] = 1;                             // column 2, row 2 (1)
    $uniformData20[11] = 0; // padding
    // グラデーションパラメータ
    $uniformData20[12] = type; // gradientType
    // focal point ratio を -0.975 ~ 0.975 にclamp（WebGL版と同じ）
    $uniformData20[13] = Math.max(-0.975, Math.min(0.975, focal)); // focal
    $uniformData20[14] = spread; // spread (0: reflect, 1: repeat, 2: pad)
    $uniformData20[15] = 819.2; // radius（Radial用、WebGL版と同じ定数）
    // Linear用の点a, b
    if (gradientData.linearPoints) {
        $uniformData20[16] = gradientData.linearPoints[0]; // a.x
        $uniformData20[17] = gradientData.linearPoints[1]; // a.y
        $uniformData20[18] = gradientData.linearPoints[2]; // b.x
        $uniformData20[19] = gradientData.linearPoints[3]; // b.y
    } else {
        $uniformData20[16] = 0;
        $uniformData20[17] = 0;
        $uniformData20[18] = 0;
        $uniformData20[19] = 0;
    }

    const uniformBuffer = buffer_manager.acquireUniformBuffer($uniformData20.byteLength);
    device.queue.writeBuffer(uniformBuffer, 0, $uniformData20.buffer, $uniformData20.byteOffset, $uniformData20.byteLength);

    // サンプラーを取得（キャッシュ済み）
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
        $releaseFillTexture(lutTexture);
        return null;
    }

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = lutTexture.createView();
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    // ストロークのメッシュは各セグメントが独立した凸多角形のため、
    // フィルのような2パスステンシル描画は不要で、直接描画で正しく描画される。
    // ステンシル付きレンダーパスの場合はステンシル互換パイプライン（compare: always）を使用する。
    const pipelineName = use_stencil_pipeline
        ? use_atlas_target ? "gradient_stroke_atlas" : "gradient_stroke_bgra"
        : use_atlas_target ? "gradient_fill" : "gradient_fill_bgra";
    const pipeline = pipeline_manager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        $releaseFillTexture(lutTexture);
        return null;
    }

    render_pass_encoder.setPipeline(pipeline);
    render_pass_encoder.setVertexBuffer(0, vertexBuffer);
    render_pass_encoder.setBindGroup(0, bindGroup);
    render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);

    // LUTテクスチャを返す（Context.tsでフレーム終了時に解放）
    return lutTexture;
};
