import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { getInstancedShaderManager } from "../../Blend/BlendInstancedManager";
import { renderQueue } from "@next2d/render-queue";

/**
 * @description インスタンス配列を描画
 *              Draw instanced arrays
 *
 * @param {GPUDevice} device
 * @param {GPUCommandEncoder} commandEncoder
 * @param {GPURenderPassEncoder | null} renderPassEncoder - 現在のレンダーパス（必要に応じて終了される）
 * @param {GPUTextureView} mainTextureView
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
    mainTextureView: GPUTextureView,
    bufferManager: BufferManager,
    frameBufferManager: FrameBufferManager,
    textureManager: TextureManager,
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

    // メインテクスチャにレンダリング
    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        mainTextureView,
        0, 0, 0, 0,
        "load" // 既存の内容を保持
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    // パイプラインを取得
    const pipeline = pipelineManager.getPipeline("instanced");
    if (!pipeline) {
        console.error("[WebGPU] Instanced pipeline not found");
        passEncoder.end();
        return null;
    }

    passEncoder.setPipeline(pipeline);

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

    // サンプラーを作成
    const sampler = textureManager.createSampler("atlas_sampler", false);

    // バインドグループを作成
    const bindGroupLayout = pipelineManager.getBindGroupLayout("instanced");
    if (!bindGroupLayout) {
        console.error("[WebGPU] Instanced bind group layout not found");
        passEncoder.end();
        return null;
    }

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: sampler
            },
            {
                binding: 1,
                resource: atlasAttachment.texture!.view
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
