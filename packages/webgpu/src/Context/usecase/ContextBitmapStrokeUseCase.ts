import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshBitmapStrokeGenerateUseCase } from "../../Mesh/usecase/MeshBitmapStrokeGenerateUseCase";
import { execute as contextComputeBitmapMatrixService } from "../service/ContextComputeBitmapMatrixService";
import { $acquireFillTexture, $releaseFillTexture } from "../../FillTexturePool";

const $bitmapSamplerCache = new Map<string, GPUSampler>();

const $uniformData16 = new Float32Array(16);

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
    // ビットマップ描画では色は白（1, 1, 1, alpha）を使用
    // ビットマップの色はテクスチャから取得され、頂点色で乗算される
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

    // Uniformバッファを作成
    $uniformData16[0] = computedBitmapMatrix[0];  // col0.x = a
    $uniformData16[1] = computedBitmapMatrix[1];  // col0.y = c
    $uniformData16[2] = computedBitmapMatrix[2];  // col0.z = 0
    $uniformData16[3] = 0; // padding
    $uniformData16[4] = computedBitmapMatrix[3];  // col1.x = b
    $uniformData16[5] = computedBitmapMatrix[4];  // col1.y = d
    $uniformData16[6] = computedBitmapMatrix[5];  // col1.z = 0
    $uniformData16[7] = 0; // padding
    $uniformData16[8] = computedBitmapMatrix[6];  // col2.x = tx
    $uniformData16[9] = computedBitmapMatrix[7];  // col2.y = ty
    $uniformData16[10] = computedBitmapMatrix[8]; // col2.z = 1
    $uniformData16[11] = 0; // padding
    // ビットマップパラメータ
    $uniformData16[12] = width;
    $uniformData16[13] = height;
    $uniformData16[14] = repeat ? 1.0 : 0.0;
    $uniformData16[15] = 0; // padding

    const uniformBuffer = buffer_manager.acquireUniformBuffer($uniformData16.byteLength);
    device.queue.writeBuffer(uniformBuffer, 0, $uniformData16.buffer, $uniformData16.byteOffset, $uniformData16.byteLength);

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
