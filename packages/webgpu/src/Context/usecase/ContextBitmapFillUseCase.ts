import type { IPath } from "../../interface/IPath";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { execute as contextComputeBitmapMatrixService } from "../service/ContextComputeBitmapMatrixService";
import { $acquireFillTexture, $releaseFillTexture } from "../../FillTexturePool";
import {
    $isMaskDrawing,
    $getMaskStencilReference
} from "../../Mask";

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
    path_vertices: IPath[],
    context_matrix: Float32Array,
    fill_style: Float32Array,
    pixels: Uint8Array,
    bitmap_matrix: Float32Array,
    width: number,
    height: number,
    repeat: boolean,
    smooth: boolean,
    viewport_width: number,
    viewport_height: number,
    use_atlas_target: boolean,
    use_stencil_pipeline: boolean = false,
    _clip_level: number = 1
): GPUTexture | null => {
    // 色（ビットマップ描画ではアルファ乗算用に使用）
    const red = fill_style[0];
    const green = fill_style[1];
    const blue = fill_style[2];
    const alpha = fill_style[3];

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
    // BitmapUniforms構造体:
    // - bitmapMatrix: mat3x3<f32> (各列がvec4にパディング = 48 bytes)
    // - textureWidth: f32 (4 bytes)
    // - textureHeight: f32 (4 bytes)
    // - repeat: f32 (4 bytes)
    // - _pad: f32 (4 bytes)
    // 合計: 64 bytes
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

    // アトラス描画時は2パスステンシル処理を使用（WebGL版と同じ）
    // Pass 1: ステンシルに書き込み
    // Pass 2: ビットマップを描画（NOT_EQUAL 0）
    // 注意: アトラスのステンシルはメインキャンバスのマスク処理とは独立
    if (use_atlas_target && use_stencil_pipeline) {
        // === Pass 1: ステンシル書き込み（カラー書き込みなし） ===
        // Front面: INCR_WRAP, Back面: DECR_WRAP
        const stencilWritePipeline = pipeline_manager.getPipeline("stencil_write");
        if (stencilWritePipeline) {
            render_pass_encoder.setPipeline(stencilWritePipeline);
            render_pass_encoder.setStencilReference(0);
            render_pass_encoder.setVertexBuffer(0, vertexBuffer);
            render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
        }

        // === Pass 2: ビットマップ描画（NOT_EQUAL 0） ===
        // アトラス描画時は常に通常モード（メインキャンバスのマスク状態を参照しない）
        const bitmapPipeline = pipeline_manager.getPipeline("bitmap_fill_stencil");
        if (bitmapPipeline) {
            render_pass_encoder.setPipeline(bitmapPipeline);
            render_pass_encoder.setStencilReference(0);
            render_pass_encoder.setBindGroup(0, bindGroup);
            render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
        }
    } else {
        // パイプラインを取得
        // - アトラス用: "bitmap_fill" (rgba8unorm, ステンシルなし)
        // - キャンバス用: "bitmap_fill_bgra" (bgra8unorm, ステンシルなし)
        // - マスク描画モード時: 何もしない（clip()でステンシル書き込み）
        // - マスクテストモード時: "bitmap_fill_bgra_stencil" (bgra8unorm, ステンシルテストあり)
        let pipelineName: string;
        if (use_atlas_target) {
            pipelineName = "bitmap_fill";
        } else if (use_stencil_pipeline) {
            if ($isMaskDrawing()) {
                // マスク描画モード: ステンシルへの書き込みはclip()で行うため、ここでは何もしない
                // clip()がINVERTでステンシルを書き込み、重複書き込みによるINVERT打ち消しを防止
                // ビットマップテクスチャは解放してnullを返す
                $releaseFillTexture(bitmapTexture);
                return null;
            }
            // マスクテストモード: ステンシル値をテストしてビットマップを描画
            pipelineName = "bitmap_fill_bgra_stencil";

        } else {
            pipelineName = "bitmap_fill_bgra";
        }
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

        // マスクテストモード時はステンシル参照値を設定
        if (use_stencil_pipeline && !use_atlas_target && !$isMaskDrawing()) {
            render_pass_encoder.setStencilReference($getMaskStencilReference());
        }

        render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
    }

    // ビットマップテクスチャを返す（Context.tsでフレーム終了時に解放）
    return bitmapTexture;
};
