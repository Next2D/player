import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { ShaderSource } from "../../Shader/ShaderSource";
import { intToStraightRGBA } from "../FilterUtil";

/**
 * @description プリアロケートされたBindGroupEntry配列 (バインディング3つ)
 */
const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];

/**
 * @description パイプラインキャッシュ（キー: matrixX,matrixY,preserveAlpha,clamp）
 */
const $pipelineCache = new Map<string, {
    pipeline: GPURenderPipeline;
    bindGroupLayout: GPUBindGroupLayout;
}>();

/**
 * @description コンボリューションフィルターを適用
 *              Apply convolution filter
 *
 * @param  {IAttachmentObject} source_attachment - 入力テクスチャ（アタッチメント）
 * @param  {number} matrix_x - マトリックスのX方向サイズ
 * @param  {number} matrix_y - マトリックスのY方向サイズ
 * @param  {Float32Array} matrix - コンボリューションマトリックス
 * @param  {number} divisor - 除算値
 * @param  {number} bias - バイアス値
 * @param  {boolean} preserve_alpha - アルファ値を保持するか
 * @param  {boolean} clamp - クランプするか
 * @param  {number} color - 代替色 (32bit整数)
 * @param  {number} alpha - アルファ値
 * @param  {IFilterConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    source_attachment: IAttachmentObject,
    matrix_x: number,
    matrix_y: number,
    matrix: Float32Array,
    divisor: number,
    bias: number,
    preserve_alpha: boolean,
    clamp: boolean,
    color: number,
    alpha: number,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, textureManager } = config;

    const width = source_attachment.width;
    const height = source_attachment.height;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    // パイプラインをキャッシュから取得または作成
    const cacheKey = `${matrix_x},${matrix_y},${preserve_alpha},${clamp}`;
    let cached = $pipelineCache.get(cacheKey);
    if (!cached) {
        const shaderCode = ShaderSource.getConvolutionFilterFragmentShader(
            matrix_x, matrix_y, preserve_alpha, clamp
        );

        const shaderModule = device.createShaderModule({ "code": shaderCode });

        const bindGroupLayout = device.createBindGroupLayout({
            "entries": [
                {
                    "binding": 0,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "buffer": { "type": "uniform" }
                },
                {
                    "binding": 1,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "sampler": {}
                },
                {
                    "binding": 2,
                    "visibility": GPUShaderStage.FRAGMENT,
                    "texture": {}
                }
            ]
        });

        const pipelineLayout = device.createPipelineLayout({
            "bindGroupLayouts": [bindGroupLayout]
        });

        const pipeline = device.createRenderPipeline({
            "layout": pipelineLayout,
            "vertex": {
                "module": shaderModule,
                "entryPoint": "vs_main",
                "buffers": []
            },
            "fragment": {
                "module": shaderModule,
                "entryPoint": "fs_main",
                "targets": [{
                    "format": "rgba8unorm",
                    "blend": {
                        "color": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        },
                        "alpha": {
                            "srcFactor": "one",
                            "dstFactor": "one-minus-src-alpha",
                            "operation": "add"
                        }
                    }
                }]
            },
            "primitive": {
                "topology": "triangle-list",
                "cullMode": "none"
            }
        });

        cached = { pipeline, bindGroupLayout };
        $pipelineCache.set(cacheKey, cached);
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("convolution_sampler", true);

    // ユニフォームバッファを作成
    const matrixSize = matrix_x * matrix_y;
    const matrixArraySize = Math.ceil(matrixSize / 4);
    const [r, g, b, a] = intToStraightRGBA(color, alpha);

    // マトリクスを4要素ごとにまとめる
    const paddedMatrix = new Float32Array(matrixArraySize * 4);
    for (let i = 0; i < matrixSize; i++) {
        paddedMatrix[i] = matrix[i];
    }

    const uniformSize = 32 + matrixArraySize * 16;
    const uniformData = new Float32Array(uniformSize / 4);
    uniformData[0] = 1 / width;  // rcpSize.x
    uniformData[1] = 1 / height; // rcpSize.y
    uniformData[2] = divisor !== 0 ? 1 / divisor : 1; // rcpDivisor
    uniformData[3] = bias / 255; // bias (normalize to 0-1)
    uniformData[4] = r;          // substituteColor.r
    uniformData[5] = g;          // substituteColor.g
    uniformData[6] = b;          // substituteColor.b
    uniformData[7] = a;          // substituteColor.a
    // matrix array starts at index 8
    for (let i = 0; i < paddedMatrix.length; i++) {
        uniformData[8 + i] = paddedMatrix[i];
    }

    const uniformBuffer = config.bufferManager
        ? config.bufferManager.acquireAndWriteUniformBuffer(uniformData)
        : device.createBuffer({
            "size": uniformData.byteLength,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    if (!config.bufferManager) {
        device.queue.writeBuffer(uniformBuffer, 0, uniformData);
    }

    // バインドグループを作成
    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = source_attachment.texture!.view;
    const bindGroup = device.createBindGroup({
        "layout": cached.bindGroupLayout,
        "entries": $entries3
    });

    // レンダーパスを実行
    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        destAttachment.texture!.view, 0, 0, 0, 0, "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(cached.pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    return destAttachment;
};
