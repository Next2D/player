import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshBitmapStrokeGenerateUseCase } from "../../Mesh/usecase/MeshBitmapStrokeGenerateUseCase";
import { execute as contextComputeBitmapMatrixService } from "../service/ContextComputeBitmapMatrixService";
import { $acquireFillTexture, $releaseFillTexture } from "../../FillTexturePool";

/**
 * @description ビットマップサンプラーのキャッシュ
 *              Cache for bitmap samplers
 */
const $bitmapSamplerCache = new Map<string, GPUSampler>();

/**
 * @description ユニフォームデータの事前確保配列（32要素）
 *              Pre-allocated uniform data array (32 elements)
 */
const $uniformData32 = new Float32Array(32);

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
 * @description ビットマップストローク描画を実行する
 *              Executes bitmap stroke rendering
 * @param {GPUDevice} device GPUデバイス / GPU device
 * @param {GPURenderPassEncoder} render_pass_encoder レンダーパスエンコーダ / Render pass encoder
 * @param {BufferManager} buffer_manager バッファマネージャ / Buffer manager
 * @param {PipelineManager} pipeline_manager パイプラインマネージャ / Pipeline manager
 * @param {IPath[]} vertices パス頂点配列 / Path vertices array
 * @param {number} thickness ストローク太さ / Stroke thickness
 * @param {Float32Array} context_matrix コンテキスト変換行列 / Context transformation matrix
 * @param {Float32Array} stroke_style ストロークスタイル（RGBA） / Stroke style (RGBA)
 * @param {Uint8Array} pixels ピクセルデータ / Pixel data
 * @param {Float32Array} bitmap_matrix ビットマップ変換行列 / Bitmap transformation matrix
 * @param {number} width テクスチャ幅 / Texture width
 * @param {number} height テクスチャ高さ / Texture height
 * @param {boolean} repeat リピート有無 / Whether to repeat
 * @param {boolean} smooth スムーズフィルタ有無 / Whether to use smooth filtering
 * @param {number} viewport_width ビューポート幅 / Viewport width
 * @param {number} viewport_height ビューポート高さ / Viewport height
 * @param {boolean} use_atlas_target アトラスターゲット使用フラグ / Whether to use atlas target
 * @param {boolean} use_stencil_pipeline ステンシルパイプライン使用フラグ / Whether to use stencil pipeline
 * @return {GPUTexture | null} ビットマップテクスチャまたはnull / Bitmap texture or null
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
    use_atlas_target: boolean,
    use_stencil_pipeline: boolean
): GPUTexture | null => {
    // ビットマップストローク用メッシュを生成（4 floats/vertex: position + bezier）
    const mesh = meshBitmapStrokeGenerateUseCase(vertices, thickness);

    if (mesh.indexCount === 0) {
        return null;
    }

    // 頂点バッファを取得（プールから再利用）
    const vertexBuffer = buffer_manager.acquireVertexBuffer(mesh.buffer.byteLength, mesh.buffer);

    // ビットマップテクスチャをプールから取得
    const bitmapTexture = $acquireFillTexture(device, width, height);

    // ピクセルデータをテクスチャに転送
    device.queue.writeTexture(
        { "texture": bitmapTexture },
        pixels.buffer,
        { "bytesPerRow": width * 4, "rowsPerImage": height, "offset": pixels.byteOffset },
        { width, height }
    );

    // ビットマップ変換行列を計算（コンテキスト行列と合成して逆行列）
    const computedBitmapMatrix = contextComputeBitmapMatrixService(bitmap_matrix, context_matrix);

    // 色とmatrix
    const red = 1;
    const green = 1;
    const blue = 1;
    const alpha = stroke_style[3] > 0 ? stroke_style[3] : 1;
    const a  = context_matrix[0];
    const b  = context_matrix[1];
    const c  = context_matrix[3];
    const d  = context_matrix[4];
    const tx = context_matrix[6];
    const ty = context_matrix[7];

    // Uniformバッファを作成（BitmapUniforms: 32 floats = 128 bytes）
    $uniformData32[0] = computedBitmapMatrix[0];  // col0.x = a
    $uniformData32[1] = computedBitmapMatrix[1];  // col0.y = c
    $uniformData32[2] = computedBitmapMatrix[2];  // col0.z = 0
    $uniformData32[3] = 0; // padding
    $uniformData32[4] = computedBitmapMatrix[3];  // col1.x = b
    $uniformData32[5] = computedBitmapMatrix[4];  // col1.y = d
    $uniformData32[6] = computedBitmapMatrix[5];  // col1.z = 0
    $uniformData32[7] = 0; // padding
    $uniformData32[8] = computedBitmapMatrix[6];  // col2.x = tx
    $uniformData32[9] = computedBitmapMatrix[7];  // col2.y = ty
    $uniformData32[10] = computedBitmapMatrix[8]; // col2.z = 1
    $uniformData32[11] = 0; // padding
    // ビットマップパラメータ
    $uniformData32[12] = width;
    $uniformData32[13] = height;
    $uniformData32[14] = repeat ? 1.0 : 0.0;
    $uniformData32[15] = 0; // padding
    // color
    $uniformData32[16] = red;
    $uniformData32[17] = green;
    $uniformData32[18] = blue;
    $uniformData32[19] = alpha;
    // contextMatrix（viewport正規化済み）
    $uniformData32[20] = a / viewport_width;
    $uniformData32[21] = b / viewport_height;
    $uniformData32[22] = 0;
    $uniformData32[23] = 0;
    $uniformData32[24] = c / viewport_width;
    $uniformData32[25] = d / viewport_height;
    $uniformData32[26] = 0;
    $uniformData32[27] = 0;
    $uniformData32[28] = tx / viewport_width;
    $uniformData32[29] = ty / viewport_height;
    $uniformData32[30] = 1;
    $uniformData32[31] = 0;

    const uniformBuffer = buffer_manager.acquireAndWriteUniformBuffer($uniformData32);

    // サンプラーを取得（キャッシュ済み）
    const samplerKey = `bitmap_${smooth ? "s" : "n"}_${repeat ? "r" : "c"}`;
    let sampler = $bitmapSamplerCache.get(samplerKey);
    if (!sampler) {
        sampler = device.createSampler({
            "magFilter": smooth ? "linear" : "nearest",
            "minFilter": smooth ? "linear" : "nearest",
            "addressModeU": repeat ? "repeat" : "clamp-to-edge",
            "addressModeV": repeat ? "repeat" : "clamp-to-edge"
        });
        $bitmapSamplerCache.set(samplerKey, sampler);
    }

    // バインドグループを作成
    const bindGroupLayout = pipeline_manager.getBindGroupLayout("bitmap_fill");
    if (!bindGroupLayout) {
        console.error("[WebGPU] bitmap_fill bind group layout not found");
        $releaseFillTexture(bitmapTexture);
        return null;
    }

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = bitmapTexture.createView();
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    // パイプラインを取得
    // ストロークのメッシュは各セグメントが独立した凸多角形のため、
    // フィルのような2パスステンシル描画は不要で、直接描画で正しく描画される。
    // ステンシル付きレンダーパスの場合はステンシル互換パイプライン（compare: always）を使用する。
    const pipelineName = use_stencil_pipeline
        ? use_atlas_target ? "bitmap_stroke_atlas" : "bitmap_stroke_bgra"
        : use_atlas_target ? "bitmap_fill" : "bitmap_fill_bgra";
    const pipeline = pipeline_manager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        $releaseFillTexture(bitmapTexture);
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
