import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { ShaderSource } from "../../Shader/ShaderSource";
import { intToPremultipliedRGBA } from "../FilterUtil";

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
 * @description パイプラインキャッシュ（キー: componentX,componentY,mode）
 */
const $pipelineCache = new Map<string, {
    pipeline: GPURenderPipeline;
    bindGroupLayout: GPUBindGroupLayout;
}>();

/**
 * @description ディスプレイスメントマップフィルターを適用
 *              Apply displacement map filter
 *
 * @param  {IAttachmentObject} source_attachment - 入力テクスチャ（アタッチメント）
 * @param  {Float32Array} _matrix - 変換行列（未使用）
 * @param  {Uint8Array} bitmap_buffer - ビットマップバッファ
 * @param  {number} bitmap_width - ビットマップ幅
 * @param  {number} bitmap_height - ビットマップ高さ
 * @param  {number} map_point_x - マップポイントX座標
 * @param  {number} map_point_y - マップポイントY座標
 * @param  {number} component_x - X方向コンポーネント
 * @param  {number} component_y - Y方向コンポーネント
 * @param  {number} scale_x - X方向スケール
 * @param  {number} scale_y - Y方向スケール
 * @param  {number} mode - ディスプレイスメントモード
 * @param  {number} color - 代替色 (32bit整数)
 * @param  {number} alpha - アルファ値
 * @param  {number} _device_pixel_ratio - デバイスピクセル比（未使用）
 * @param  {IFilterConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    source_attachment: IAttachmentObject,
    _matrix: Float32Array,
    bitmap_buffer: Uint8Array,
    bitmap_width: number,
    bitmap_height: number,
    map_point_x: number,
    map_point_y: number,
    component_x: number,
    component_y: number,
    scale_x: number,
    scale_y: number,
    mode: number,
    color: number,
    alpha: number,
    _device_pixel_ratio: number,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, textureManager } = config;

    const width = source_attachment.width;
    const height = source_attachment.height;

    // WebGL版と同じ: baseWidth/baseHeightはビットマップサイズを使用
    const baseWidth = bitmap_width;
    const baseHeight = bitmap_height;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    // マップテクスチャを作成
    const mapTexture = device.createTexture({
        "size": { "width": bitmap_width, "height": bitmap_height },
        "format": "rgba8unorm",
        "usage": GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
    });
    device.queue.writeTexture(
        { "texture": mapTexture },
        bitmap_buffer.buffer,
        { "bytesPerRow": bitmap_width * 4, "offset": bitmap_buffer.byteOffset },
        { "width": bitmap_width, "height": bitmap_height }
    );

    // パイプラインをキャッシュから取得または作成
    const cacheKey = `${component_x},${component_y},${mode}`;
    let cached = $pipelineCache.get(cacheKey);
    if (!cached) {
        const fragmentShaderCode = ShaderSource.getDisplacementMapFilterFragmentShader(
            component_x, component_y, mode
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
    $uniform12[0] = baseWidth / bitmap_width;
    $uniform12[1] = baseHeight / bitmap_height;

    // uvToStOffset
    $uniform12[2] = map_point_x / bitmap_width;
    $uniform12[3] = (baseHeight - bitmap_height - map_point_y) / bitmap_height;

    // scale
    $uniform12[4] = scale_x / baseWidth;
    $uniform12[5] = scale_y / baseHeight;

    // padding
    $uniform12[6] = 0;
    $uniform12[7] = 0;

    // substituteColor (mode === 1 の場合)
    if (needsSubstituteColor) {
        const [r, g, b, a] = intToPremultipliedRGBA(color, alpha);
        $uniform12[8] = r;
        $uniform12[9] = g;
        $uniform12[10] = b;
        $uniform12[11] = a;
    }

    const uniformBuffer = config.bufferManager
        ? config.bufferManager.acquireAndWriteUniformBuffer($uniform12, uniformSize)
        : device.createBuffer({
            "size": uniformSize,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    if (!config.bufferManager) {
        device.queue.writeBuffer(uniformBuffer, 0, $uniform12, 0, uniformSize / 4);
    }

    // バインドグループを作成
    ($entries4[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries4[1].resource = sampler;
    $entries4[2].resource = source_attachment.texture!.view;
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

    // クリーンアップ（mapTextureはsubmit後に遅延破棄）
    config.frameTextures.push(mapTexture);

    return destAttachment;
};
