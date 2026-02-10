import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { ShaderSource } from "../../Shader/ShaderSource";

/**
 * @description プリアロケートされたBindGroupEntry配列 (バインディング3つ)
 */
const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];

/**
 * @description 32bit整数からRGB値を抽出
 */
const intToRGBA = (color: number, alpha: number): [number, number, number, number] => {
    const r = (color >> 16 & 0xFF) / 255;
    const g = (color >> 8 & 0xFF) / 255;
    const b = (color & 0xFF) / 255;
    return [r, g, b, alpha];
};

/**
 * @description パイプラインキャッシュ（キー: matrixX,matrixY,preserveAlpha,clamp）
 */
const $pipelineCache = new Map<string, {
    pipeline: GPURenderPipeline;
    bindGroupLayout: GPUBindGroupLayout;
}>();

/**
 * @description コンボリューションフィルターを適用
 */
export const execute = (
    sourceAttachment: IAttachmentObject,
    matrixX: number,
    matrixY: number,
    matrix: Float32Array,
    divisor: number,
    bias: number,
    preserveAlpha: boolean,
    clamp: boolean,
    color: number,
    alpha: number,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, textureManager } = config;

    const width = sourceAttachment.width;
    const height = sourceAttachment.height;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    // パイプラインをキャッシュから取得または作成
    const cacheKey = `${matrixX},${matrixY},${preserveAlpha},${clamp}`;
    let cached = $pipelineCache.get(cacheKey);
    if (!cached) {
        const shaderCode = ShaderSource.getConvolutionFilterFragmentShader(
            matrixX, matrixY, preserveAlpha, clamp
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
    const matrixSize = matrixX * matrixY;
    const matrixArraySize = Math.ceil(matrixSize / 4);
    const [r, g, b, a] = intToRGBA(color, alpha);

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
    $entries3[2].resource = sourceAttachment.texture!.view;
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
