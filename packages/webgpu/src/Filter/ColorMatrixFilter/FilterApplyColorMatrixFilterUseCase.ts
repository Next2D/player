import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";

/**
 * @description プリアロケートされたFloat32Array
 */
const $uniform20 = new Float32Array(20);

/**
 * @description プリアロケートされたBindGroupEntry配列 (バインディング3つ)
 */
const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];

/**
 * @description カラーマトリックスフィルターを適用
 *              Apply color matrix filter
 *
 * @param  {IAttachmentObject} sourceAttachment - 入力テクスチャ（アタッチメント）
 * @param  {Float32Array} matrix - 4x5カラーマトリックス (20 floats)
 * @param  {IFilterConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    sourceAttachment: IAttachmentObject,
    matrix: Float32Array,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(
        sourceAttachment.width,
        sourceAttachment.height
    );

    const pipeline = pipelineManager.getPipeline("color_matrix_filter");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("color_matrix_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU ColorMatrixFilter] Pipeline not found");
        return sourceAttachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("color_matrix_sampler", true);

    // ユニフォームバッファを作成
    // 4x4 matrix (64 bytes) + offset vec4 (16 bytes) = 80 bytes
    // WebGPUのmat4x4は列優先なので、入力の4x5行列を変換
    // 入力: [r0, r1, r2, r3, r4, g0, g1, g2, g3, g4, b0, b1, b2, b3, b4, a0, a1, a2, a3, a4]
    // 出力: mat4x4 (row-wise to column-wise) + offset vec4
    // Column 0: R coefficients
    $uniform20[0] = matrix[0];
    $uniform20[1] = matrix[5];
    $uniform20[2] = matrix[10];
    $uniform20[3] = matrix[15];
    // Column 1: G coefficients
    $uniform20[4] = matrix[1];
    $uniform20[5] = matrix[6];
    $uniform20[6] = matrix[11];
    $uniform20[7] = matrix[16];
    // Column 2: B coefficients
    $uniform20[8] = matrix[2];
    $uniform20[9] = matrix[7];
    $uniform20[10] = matrix[12];
    $uniform20[11] = matrix[17];
    // Column 3: A coefficients
    $uniform20[12] = matrix[3];
    $uniform20[13] = matrix[8];
    $uniform20[14] = matrix[13];
    $uniform20[15] = matrix[18];
    // Offset values (R, G, B, A) - normalized to 0-1 range (input is 0-255)
    $uniform20[16] = matrix[4] / 255;
    $uniform20[17] = matrix[9] / 255;
    $uniform20[18] = matrix[14] / 255;
    $uniform20[19] = matrix[19] / 255;

    const uniformBuffer = config.bufferManager
        ? config.bufferManager.acquireUniformBuffer($uniform20.byteLength)
        : device.createBuffer({
            "size": $uniform20.byteLength,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    device.queue.writeBuffer(uniformBuffer, 0, $uniform20);

    // バインドグループを作成
    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = sourceAttachment.texture!.view;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    // レンダーパスを実行
    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        destAttachment.texture!.view, 0, 0, 0, 0, "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    // Note: uniformBuffer is not destroyed here - it will be garbage collected after GPU submission

    return destAttachment;
};
