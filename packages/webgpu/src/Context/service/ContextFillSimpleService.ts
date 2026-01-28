import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { $isMaskDrawing, $getMaskStencilReference } from "../../Mask";

/**
 * @description 単純なフィル（ステンシルなし、キャンバス描画用）
 *              Simple fill without stencil for canvas rendering
 *
 * @param {GPUDevice} device
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {BufferManager} bufferManager
 * @param {PipelineManager} pipelineManager
 * @param {GPUBuffer} vertexBuffer
 * @param {number} vertexCount
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @param {boolean} useAtlasTarget - アトラスターゲットを使用するかどうか
 * @param {boolean} useStencilPipeline - マスクモード時にステンシル付きパイプラインを使用
 * @param {number} clipLevel - マスク描画時のクリップレベル（1-8）
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    renderPassEncoder: GPURenderPassEncoder,
    bufferManager: BufferManager,
    pipelineManager: PipelineManager,
    vertexBuffer: GPUBuffer,
    vertexCount: number,
    viewportWidth: number,
    viewportHeight: number,
    useAtlasTarget: boolean,
    useStencilPipeline: boolean = false,
    clipLevel: number = 1
): void => {
    // Uniform data: viewport size only (8 bytes → 16 bytes aligned)
    const uniformData = new Float32Array(4);
    uniformData[0] = viewportWidth;
    uniformData[1] = viewportHeight;
    uniformData[2] = 0;
    uniformData[3] = 0;

    const uniformBuffer = bufferManager.createUniformBuffer(
        `fill_uniform_${Date.now()}`,
        uniformData.byteLength
    );
    device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    // バインドグループを作成
    const bindGroupLayout = pipelineManager.getBindGroupLayout("fill");
    if (!bindGroupLayout) {
        console.error("[WebGPU] Fill bind group layout not found");
        return;
    }

    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [{
            "binding": 0,
            "resource": { "buffer": uniformBuffer }
        }]
    });

    // パイプラインを取得して描画
    // - アトラス用: "fill" (rgba8unorm)
    // - キャンバス用: "fill_bgra" (bgra8unorm, ステンシルなし)
    // - マスク描画モード時: "clip_write_main_N" (ステンシル書き込み、カラー書き込みなし)
    // - マスクテストモード時: "fill_bgra_stencil" (bgra8unorm, ステンシルテストあり)
    let pipelineName: string;
    if (useAtlasTarget) {
        pipelineName = "fill";
    } else if (useStencilPipeline) {
        if ($isMaskDrawing()) {
            // マスク描画モード: ステンシルにINVERT操作で書き込み、カラーは書き込まない
            // WebGL版: stencilOp(ZERO, INVERT, INVERT), colorMask(false, false, false, false)
            const clampedLevel = Math.min(8, Math.max(1, clipLevel));
            pipelineName = `clip_write_main_${clampedLevel}`;
        } else {
            // マスクテストモード: ステンシル値をテストしてカラーを描画
            // WebGL版: stencilFunc(EQUAL, mask & 0xff, mask)
            pipelineName = "fill_bgra_stencil";
        }
    } else {
        pipelineName = "fill_bgra";
    }
    const pipeline = pipelineManager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        return;
    }

    renderPassEncoder.setPipeline(pipeline);
    renderPassEncoder.setVertexBuffer(0, vertexBuffer);
    renderPassEncoder.setBindGroup(0, bindGroup);

    // マスクテストモード時はステンシル参照値を設定
    // WebGL版: stencilFunc(EQUAL, mask & 0xff, mask)
    if (useStencilPipeline && !useAtlasTarget && !$isMaskDrawing()) {
        renderPassEncoder.setStencilReference($getMaskStencilReference());
    }

    renderPassEncoder.draw(vertexCount, 1, 0, 0);
};
