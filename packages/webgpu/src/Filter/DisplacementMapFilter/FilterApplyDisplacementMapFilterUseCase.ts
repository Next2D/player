import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { ShaderSource } from "../../Shader/ShaderSource";

/**
 * @description プリアロケートされたFloat32Array (サイズ12: 最大48バイト)
 */
const $uniform12 = new Float32Array(12);

/**
 * @description プリアロケートされたBindGroupEntry配列 (バインディング4つ)
 */
const $entries4: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView },
    { "binding": 3, "resource": null as unknown as GPUTextureView }
];

/**
 * @description 32bit整数からRGB値を抽出（プリマルチプライドアルファ）
 */
const intToRGBA = (color: number, alpha: number): [number, number, number, number] => {
    const r = (color >> 16 & 0xFF) / 255 * alpha;
    const g = (color >> 8 & 0xFF) / 255 * alpha;
    const b = (color & 0xFF) / 255 * alpha;
    return [r, g, b, alpha];
};

/**
 * @description パイプラインキャッシュ（キー: componentX,componentY,mode）
 */
const $pipelineCache = new Map<string, {
    pipeline: GPURenderPipeline;
    bindGroupLayout: GPUBindGroupLayout;
}>();

/**
 * @description ディスプレイスメントマップフィルターを適用
 */
export const execute = (
    sourceAttachment: IAttachmentObject,
    matrix: Float32Array,
    bitmapBuffer: Uint8Array,
    bitmapWidth: number,
    bitmapHeight: number,
    mapPointX: number,
    mapPointY: number,
    componentX: number,
    componentY: number,
    scaleX: number,
    scaleY: number,
    mode: number,
    color: number,
    alpha: number,
    devicePixelRatio: number,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, textureManager } = config;

    const width = sourceAttachment.width;
    const height = sourceAttachment.height;

    // WebGL版と同じ: baseWidth/baseHeightはビットマップサイズを使用
    const baseWidth = bitmapWidth;
    const baseHeight = bitmapHeight;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    // マップテクスチャを作成
    const mapTexture = device.createTexture({
        "size": { "width": bitmapWidth, "height": bitmapHeight },
        "format": "rgba8unorm",
        "usage": GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
    });
    device.queue.writeTexture(
        { "texture": mapTexture },
        bitmapBuffer.buffer,
        { "bytesPerRow": bitmapWidth * 4, "offset": bitmapBuffer.byteOffset },
        { "width": bitmapWidth, "height": bitmapHeight }
    );

    // パイプラインをキャッシュから取得または作成
    const cacheKey = `${componentX},${componentY},${mode}`;
    let cached = $pipelineCache.get(cacheKey);
    if (!cached) {
        const fragmentShaderCode = ShaderSource.getDisplacementMapFilterFragmentShader(
            componentX, componentY, mode
        );

        const vertexShaderModule = device.createShaderModule({
            "code": ShaderSource.getBlurFilterVertexShader()
        });

        const fragmentShaderModule = device.createShaderModule({
            "code": fragmentShaderCode
        });

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
                },
                {
                    "binding": 3,
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
                "module": vertexShaderModule,
                "entryPoint": "main",
                "buffers": []
            },
            "fragment": {
                "module": fragmentShaderModule,
                "entryPoint": "main",
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
    const sampler = textureManager.createSampler("displacement_sampler", true);

    // ユニフォームバッファを作成
    const needsSubstituteColor = mode === 1;
    const uniformSize = needsSubstituteColor ? 48 : 32;

    // uvToStScale
    $uniform12[0] = baseWidth / bitmapWidth;
    $uniform12[1] = baseHeight / bitmapHeight;

    // uvToStOffset
    $uniform12[2] = mapPointX / bitmapWidth;
    $uniform12[3] = (baseHeight - bitmapHeight - mapPointY) / bitmapHeight;

    // scale
    $uniform12[4] = scaleX / baseWidth;
    $uniform12[5] = scaleY / baseHeight;

    // padding
    $uniform12[6] = 0;
    $uniform12[7] = 0;

    // substituteColor (mode === 1 の場合)
    if (needsSubstituteColor) {
        const [r, g, b, a] = intToRGBA(color, alpha);
        $uniform12[8] = r;
        $uniform12[9] = g;
        $uniform12[10] = b;
        $uniform12[11] = a;
    }

    const uniformBuffer = config.bufferManager
        ? config.bufferManager.acquireUniformBuffer(uniformSize)
        : device.createBuffer({
            "size": uniformSize,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    device.queue.writeBuffer(uniformBuffer, 0, $uniform12, 0, uniformSize / 4);

    // バインドグループを作成
    ($entries4[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries4[1].resource = sampler;
    $entries4[2].resource = sourceAttachment.texture!.view;
    $entries4[3].resource = mapTexture.createView();
    const bindGroup = device.createBindGroup({
        "layout": cached.bindGroupLayout,
        "entries": $entries4
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
