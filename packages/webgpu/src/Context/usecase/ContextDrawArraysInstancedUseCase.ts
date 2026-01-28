import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { getInstancedShaderManager } from "../../Blend/BlendInstancedManager";
import { renderQueue } from "@next2d/render-queue";
import {
    $isMaskTestEnabled,
    $getMaskStencilReference
} from "../../Mask";
import { isDebugEnabled, logInstanced } from "../../Debug/DebugLogger";

/**
 * @description インスタンス配列を描画
 *              Draw instanced arrays
 *
 * @param {GPUDevice} device
 * @param {GPUCommandEncoder} commandEncoder
 * @param {GPURenderPassEncoder | null} renderPassEncoder - 現在のレンダーパス（必要に応じて終了される）
 * @param {IAttachmentObject} mainAttachment - メインアタッチメント（ステンシル付き）
 * @param {BufferManager} bufferManager
 * @param {FrameBufferManager} frameBufferManager
 * @param {TextureManager} textureManager
 * @param {PipelineManager} pipelineManager
 * @return {GPURenderPassEncoder | null} - 終了したレンダーパス
 */
export const execute = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    renderPassEncoder: GPURenderPassEncoder | null,
    mainAttachment: IAttachmentObject,
    bufferManager: BufferManager,
    frameBufferManager: FrameBufferManager,
    _textureManager: TextureManager,
    pipelineManager: PipelineManager
): GPURenderPassEncoder | null => {
    const shaderManager = getInstancedShaderManager();

    if (shaderManager.count === 0) {
        return renderPassEncoder;
    }

    // 既存のレンダーパスを終了
    if (renderPassEncoder) {
        renderPassEncoder.end();
        renderPassEncoder = null;
    }

    const isMasked = $isMaskTestEnabled();
    const maskReference = $getMaskStencilReference();

    // パイプラインを先に取得して、ステンシルが必要かどうかを判定
    // マスク有効かつmaskedパイプラインが存在する場合のみステンシルを使用
    const maskedPipeline = pipelineManager.getPipeline("instanced_masked");
    const normalPipeline = pipelineManager.getPipeline("instanced");

    // 実際にマスクを使用するか判定
    // maskedパイプラインが存在し、マスクが有効で、ステンシルがある場合のみ
    const useStencil = isMasked && maskedPipeline && mainAttachment.stencil?.view;

    // デバッグ出力: インスタンス描画時のマスク状態を追跡
    if (isDebugEnabled()) {
        logInstanced("ContextDrawArraysInstancedUseCase execute", {
            "isMasked": isMasked,
            "maskReference": maskReference,
            "hasMaskedPipeline": !!maskedPipeline,
            "hasStencilView": !!mainAttachment.stencil?.view,
            "useStencil": !!useStencil,
            "instanceCount": shaderManager.count
        });
        console.log("[WebGPU Instanced] Stencil label:", mainAttachment.stencil?.resource?.label || "unknown");
    }

    const pipeline = useStencil ? maskedPipeline : normalPipeline;

    if (!pipeline) {
        console.error("[WebGPU] Instanced pipeline not found");
        return null;
    }

    // レンダーパスを作成（パイプラインに合わせてステンシルの有無を決定）
    let passEncoder: GPURenderPassEncoder;

    if (useStencil) {
        // ステンシル付きレンダーパス（マスク用）
        const renderPassDescriptor = frameBufferManager.createStencilRenderPassDescriptor(
            mainAttachment.texture!.view,
            mainAttachment.stencil!.view,
            "load", // カラーは既存の内容を保持
            "load"  // ステンシルも既存の内容を保持（マスク情報）
        );
        passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    } else {
        // 通常のレンダーパス
        const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
            mainAttachment.texture!.view,
            0, 0, 0, 0,
            "load" // 既存の内容を保持
        );
        passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    }

    passEncoder.setPipeline(pipeline);

    // マスク有効時はステンシル参照値を設定
    if (useStencil) {
        passEncoder.setStencilReference(maskReference);
    }

    // インスタンスバッファを作成
    // renderQueue.offsetは配列のインデックスなので、そのまま使用
    const instanceData = new Float32Array(
        renderQueue.buffer.buffer,
        renderQueue.buffer.byteOffset,
        renderQueue.offset  // 要素数
    );

    const instanceBuffer = bufferManager.createVertexBuffer(
        `instance_${Date.now()}`,
        instanceData
    );

    // 頂点バッファ（矩形）を作成
    const vertices = bufferManager.createRectVertices(0, 0, 1, 1);
    const vertexBuffer = bufferManager.createVertexBuffer(
        `vertex_${Date.now()}`,
        vertices
    );

    // アトラステクスチャをバインド
    const atlasAttachment = frameBufferManager.getAttachment("atlas");
    if (!atlasAttachment) {
        console.error("[WebGPU] Atlas attachment not found");
        passEncoder.end();
        return null;
    }

    // アトラス用サンプラーを作成（WebGL版と同様の設定）
    // MIN_FILTER: linear（縮小時・回転時にスムーズ）
    // MAG_FILTER: nearest（拡大時にシャープ）
    const sampler = device.createSampler({
        "minFilter": "linear",
        "magFilter": "nearest",
        "mipmapFilter": "nearest",
        "addressModeU": "clamp-to-edge",
        "addressModeV": "clamp-to-edge"
    });

    // バインドグループを作成
    const bindGroupLayout = pipelineManager.getBindGroupLayout("instanced");
    if (!bindGroupLayout) {
        console.error("[WebGPU] Instanced bind group layout not found");
        passEncoder.end();
        return null;
    }

    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [
            {
                "binding": 0,
                "resource": sampler
            },
            {
                "binding": 1,
                "resource": atlasAttachment.texture!.view
            }
        ]
    });

    // 描画
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setVertexBuffer(1, instanceBuffer);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, shaderManager.count, 0, 0);

    // レンダーパスを終了
    passEncoder.end();

    // インスタンスデータをクリア
    shaderManager.clear();

    return null;
};
