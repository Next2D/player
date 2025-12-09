import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { ShaderSource } from "../../Shader/ShaderSource";

/**
 * @description 32bit整数からRGB値を抽出（プリマルチプライドアルファ）
 */
const intToRGBA = (color: number, alpha: number): [number, number, number, number] => {
    const r = ((color >> 16) & 0xFF) / 255 * alpha;
    const g = ((color >> 8) & 0xFF) / 255 * alpha;
    const b = (color & 0xFF) / 255 * alpha;
    return [r, g, b, alpha];
};

/**
 * @description ディスプレイスメントマップフィルターを適用
 *              Apply displacement map filter
 *
 * @param  {IAttachmentObject} sourceAttachment - 入力テクスチャ
 * @param  {Float32Array} matrix - 変換行列
 * @param  {Uint8Array} bitmapBuffer - マップビットマップデータ
 * @param  {number} bitmapWidth - マップビットマップ幅
 * @param  {number} bitmapHeight - マップビットマップ高さ
 * @param  {number} mapPointX - マップポイントX
 * @param  {number} mapPointY - マップポイントY
 * @param  {number} componentX - X方向コンポーネント (1=RED, 2=GREEN, 4=BLUE, 8=ALPHA)
 * @param  {number} componentY - Y方向コンポーネント
 * @param  {number} scaleX - X方向スケール
 * @param  {number} scaleY - Y方向スケール
 * @param  {number} mode - モード (0=clamp, 1=color, 2=wrap, 3=ignore)
 * @param  {number} color - 置換色
 * @param  {number} alpha - 置換アルファ
 * @param  {number} devicePixelRatio - デバイスピクセル比
 * @param  {IDisplacementMapConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
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

    // 変換行列からスケールを取得
    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]) / devicePixelRatio;
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]) / devicePixelRatio;

    const baseWidth = width / xScale;
    const baseHeight = height / yScale;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    // マップテクスチャを作成
    const mapTexture = device.createTexture({
        size: { width: bitmapWidth, height: bitmapHeight },
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
    });
    device.queue.writeTexture(
        { texture: mapTexture },
        bitmapBuffer.buffer,
        { bytesPerRow: bitmapWidth * 4, offset: bitmapBuffer.byteOffset },
        { width: bitmapWidth, height: bitmapHeight }
    );

    // 動的にシェーダーを生成
    const fragmentShaderCode = ShaderSource.getDisplacementMapFilterFragmentShader(
        componentX, componentY, mode
    );

    const vertexShaderModule = device.createShaderModule({
        code: ShaderSource.getBlurFilterVertexShader()
    });

    const fragmentShaderModule = device.createShaderModule({
        code: fragmentShaderCode
    });

    // バインドグループレイアウトを作成
    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.FRAGMENT,
                buffer: { type: "uniform" }
            },
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {}
            },
            {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {}
            },
            {
                binding: 3,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {}
            }
        ]
    });

    const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
    });

    // パイプラインを作成
    const pipeline = device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: {
            module: vertexShaderModule,
            entryPoint: "main",
            buffers: []
        },
        fragment: {
            module: fragmentShaderModule,
            entryPoint: "main",
            targets: [{
                format: "rgba8unorm",
                blend: {
                    color: {
                        srcFactor: "one",
                        dstFactor: "one-minus-src-alpha",
                        operation: "add"
                    },
                    alpha: {
                        srcFactor: "one",
                        dstFactor: "one-minus-src-alpha",
                        operation: "add"
                    }
                }
            }]
        },
        primitive: {
            topology: "triangle-list",
            cullMode: "none"
        }
    });

    // サンプラーを作成
    const sampler = textureManager.createSampler("displacement_sampler", true);

    // ユニフォームバッファを作成
    // uvToStScale: vec2<f32> (8 bytes)
    // uvToStOffset: vec2<f32> (8 bytes)
    // scale: vec2<f32> (8 bytes)
    // padding: vec2<f32> (8 bytes)
    // substituteColor: vec4<f32> (16 bytes) - mode === 1 の場合のみ
    // Total: 32 or 48 bytes
    const needsSubstituteColor = mode === 1;
    const uniformSize = needsSubstituteColor ? 48 : 32;
    const uniformData = new Float32Array(uniformSize / 4);

    // uvToStScale
    uniformData[0] = baseWidth / bitmapWidth;
    uniformData[1] = baseHeight / bitmapHeight;

    // uvToStOffset
    uniformData[2] = mapPointX / bitmapWidth;
    uniformData[3] = (baseHeight - bitmapHeight - mapPointY) / bitmapHeight;

    // scale
    uniformData[4] = scaleX / baseWidth;
    uniformData[5] = -scaleY / baseHeight;

    // padding
    uniformData[6] = 0;
    uniformData[7] = 0;

    // substituteColor (mode === 1 の場合)
    if (needsSubstituteColor) {
        const [r, g, b, a] = intToRGBA(color, alpha);
        uniformData[8] = r;
        uniformData[9] = g;
        uniformData[10] = b;
        uniformData[11] = a;
    }

    const uniformBuffer = device.createBuffer({
        size: uniformData.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    // バインドグループを作成
    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: sourceAttachment.texture!.view },
            { binding: 3, resource: mapTexture.createView() }
        ]
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

    // クリーンアップ
    uniformBuffer.destroy();
    mapTexture.destroy();

    return destAttachment;
};
