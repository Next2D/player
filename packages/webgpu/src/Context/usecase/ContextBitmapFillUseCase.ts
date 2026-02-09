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

const $uniformData32 = new Float32Array(32);

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
    // MeshFillGenerateUseCaseで頂点データを生成（4 floats/vertex: position + bezier）
    const mesh = meshFillGenerateUseCase(path_vertices);

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
    const red = fill_style[0];
    const green = fill_style[1];
    const blue = fill_style[2];
    const alpha = fill_style[3];
    const a  = context_matrix[0];
    const b  = context_matrix[1];
    const c  = context_matrix[3];
    const d  = context_matrix[4];
    const tx = context_matrix[6];
    const ty = context_matrix[7];

    // Uniformバッファを作成（BitmapUniforms: 28 floats = 112 bytes）
    // bitmapMatrix: mat3x3<f32> (48 bytes)
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
    // contextMatrix2
    $uniformData32[28] = tx / viewport_width;
    $uniformData32[29] = ty / viewport_height;
    $uniformData32[30] = 1;
    $uniformData32[31] = 0;

    const uniformBuffer = buffer_manager.acquireUniformBuffer($uniformData32.byteLength);
    device.queue.writeBuffer(uniformBuffer, 0, $uniformData32.buffer, $uniformData32.byteOffset, $uniformData32.byteLength);

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

    // ステンシル書き込みパス用のFillUniforms作成ヘルパー
    const createStencilBindGroup = (pipelineName: string): GPUBindGroup | null => {
        const pipeline = pipeline_manager.getPipeline(pipelineName);
        if (!pipeline) {
            return null;
        }
        const stencilLayout = pipeline.getBindGroupLayout(0);
        // FillUniforms: color(16) + matrix0(16) + matrix1(16) + matrix2(16) = 64 bytes
        const stencilData = new Float32Array(16);
        stencilData[0] = red;
        stencilData[1] = green;
        stencilData[2] = blue;
        stencilData[3] = alpha;
        stencilData[4] = a / viewport_width;
        stencilData[5] = b / viewport_height;
        stencilData[6] = 0;
        stencilData[7] = 0;
        stencilData[8] = c / viewport_width;
        stencilData[9] = d / viewport_height;
        stencilData[10] = 0;
        stencilData[11] = 0;
        stencilData[12] = tx / viewport_width;
        stencilData[13] = ty / viewport_height;
        stencilData[14] = 1;
        stencilData[15] = 0;
        const stencilUniformBuffer = buffer_manager.acquireUniformBuffer(stencilData.byteLength);
        device.queue.writeBuffer(stencilUniformBuffer, 0, stencilData.buffer, stencilData.byteOffset, stencilData.byteLength);
        return device.createBindGroup({
            "layout": stencilLayout,
            "entries": [{
                "binding": 0,
                "resource": { "buffer": stencilUniformBuffer }
            }]
        });
    };

    // アトラス描画時は2パスステンシル処理を使用（WebGL版と同じ）
    if (use_atlas_target && use_stencil_pipeline) {
        // === Pass 1: ステンシル書き込み（カラー書き込みなし） ===
        const stencilWritePipeline = pipeline_manager.getPipeline("stencil_write");
        if (stencilWritePipeline) {
            const stencilBindGroup = createStencilBindGroup("stencil_write");
            if (stencilBindGroup) {
                render_pass_encoder.setPipeline(stencilWritePipeline);
                render_pass_encoder.setStencilReference(0);
                render_pass_encoder.setVertexBuffer(0, vertexBuffer);
                render_pass_encoder.setBindGroup(0, stencilBindGroup);
                render_pass_encoder.draw(mesh.indexCount, 1, 0, 0);
            }
        }

        // === Pass 2: ビットマップ描画（NOT_EQUAL 0） ===
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
