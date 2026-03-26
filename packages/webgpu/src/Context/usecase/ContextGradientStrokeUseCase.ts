import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshGradientStrokeGenerateUseCase } from "../../Mesh/usecase/MeshGradientStrokeGenerateUseCase";
import { generateGradientLUT, getAdaptiveResolution } from "../../Gradient/GradientLUTGenerator";
import { execute as contextComputeGradientMatrixService } from "../service/ContextComputeGradientMatrixService";
import { $getLUTFromCache, $putLUTToCache } from "../../Gradient/GradientLUTCache";
import { $acquireFillTexture } from "../../FillTexturePool";

/**
 * @description グラデーションサンプラーのキャッシュ
 *              Cached gradient sampler
 */
let $gradientSampler: GPUSampler | null = null;

/**
 * @description ユニフォームデータの事前確保配列（36要素）
 *              Pre-allocated uniform data array (36 elements)
 */
const $uniformData36 = new Float32Array(36);

/**
 * @description バインドグループエントリの事前確保配列
 *              Pre-allocated bind group entry array
 */
const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];

/**
 * @description グラデーションストローク描画を実行する
 *              Executes gradient stroke rendering
 * @param {GPUDevice} device GPUデバイス / GPU device
 * @param {GPURenderPassEncoder} render_pass_encoder レンダーパスエンコーダ / Render pass encoder
 * @param {BufferManager} buffer_manager バッファマネージャ / Buffer manager
 * @param {PipelineManager} pipeline_manager パイプラインマネージャ / Pipeline manager
 * @param {IPath[]} vertices パス頂点配列 / Path vertices array
 * @param {number} thickness ストローク太さ / Stroke thickness
 * @param {Float32Array} context_matrix コンテキスト変換行列 / Context transformation matrix
 * @param {Float32Array} stroke_style ストロークスタイル（RGBA） / Stroke style (RGBA)
 * @param {number} type グラデーションタイプ / Gradient type
 * @param {number[]} stops グラデーションストップ配列 / Gradient stops array
 * @param {Float32Array} gradient_matrix グラデーション変換行列 / Gradient transformation matrix
 * @param {number} spread スプレッドモード / Spread mode
 * @param {number} interpolation 補間モード / Interpolation mode
 * @param {number} focal 焦点距離 / Focal point
 * @param {number} viewport_width ビューポート幅 / Viewport width
 * @param {number} viewport_height ビューポート高さ / Viewport height
 * @param {boolean} use_atlas_target アトラスターゲット使用フラグ / Whether to use atlas target
 * @param {boolean} use_stencil_pipeline ステンシルパイプライン使用フラグ / Whether to use stencil pipeline
 * @return {GPUTexture | null} LUTテクスチャまたはnull / LUT texture or null
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
    // グラデーションストローク用メッシュを生成（4 floats/vertex: position + bezier）
    const mesh = meshGradientStrokeGenerateUseCase(vertices, thickness);

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
            lutData as unknown as ArrayBufferView<ArrayBuffer>,
            { "bytesPerRow": lutResolution * 4, "rowsPerImage": 1 },
            { "width": lutResolution, "height": 1 }
        );

        lutView = lutTexture.createView();
        $putLUTToCache(stops, spread, interpolation, lutTexture, lutView);
    }

    // WebGL版と同じ計算でグラデーション変換データを取得
    const gradientData = contextComputeGradientMatrixService(gradient_matrix, context_matrix, type);

    // 色とmatrix
    const alpha = stroke_style[3] > 0 ? stroke_style[3] : 1;
    const a  = context_matrix[0];
    const b  = context_matrix[1];
    const c  = context_matrix[3];
    const d  = context_matrix[4];
    const tx = context_matrix[6];
    const ty = context_matrix[7];

    // Uniformバッファを作成（GradientUniforms: 36 floats = 144 bytes）
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
    $uniformData36[15] = 819.2; // radius
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
    $uniformData36[20] = 1;
    $uniformData36[21] = 1;
    $uniformData36[22] = 1;
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
    $uniformData36[32] = tx / viewport_width;
    $uniformData36[33] = ty / viewport_height;
    $uniformData36[34] = 1;
    $uniformData36[35] = 0;

    const uniformBuffer = buffer_manager.acquireAndWriteUniformBuffer($uniformData36);

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
        return null;
    }

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = lutView;
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
    const pipeline = pipeline_manager.getGradientPipeline(pipelineName, type, spread);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        return null;
    }

    render_pass_encoder.setPipeline(pipeline);
    render_pass_encoder.setVertexBuffer(0, vertexBuffer);
    render_pass_encoder.setBindGroup(0, bindGroup);
    render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);

    // LUTテクスチャはキャッシュ管理
    return null;
};
