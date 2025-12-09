import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { ShaderSource } from "../../Shader/ShaderSource";

/**
 * @description コンボリューションフィルター処理の設定
 *              Convolution filter processing configuration
 */
interface IConvolutionConfig {
    device: GPUDevice;
    commandEncoder: GPUCommandEncoder;
    frameBufferManager: {
        createTemporaryAttachment(width: number, height: number): IAttachmentObject;
        releaseTemporaryAttachment(attachment: IAttachmentObject): void;
        createRenderPassDescriptor(
            view: GPUTextureView,
            r: number, g: number, b: number, a: number,
            loadOp: GPULoadOp
        ): GPURenderPassDescriptor;
    };
    textureManager: {
        createSampler(name: string, smooth: boolean): GPUSampler;
    };
}

/**
 * @description 32bit整数からRGB値を抽出
 */
const intToRGBA = (color: number, alpha: number): [number, number, number, number] => {
    const r = ((color >> 16) & 0xFF) / 255;
    const g = ((color >> 8) & 0xFF) / 255;
    const b = (color & 0xFF) / 255;
    return [r, g, b, alpha];
};

/**
 * @description コンボリューションフィルターを適用
 *              Apply convolution filter
 *
 * @param  {IAttachmentObject} sourceAttachment - 入力テクスチャ
 * @param  {number} matrixX - 行列のX方向サイズ
 * @param  {number} matrixY - 行列のY方向サイズ
 * @param  {Float32Array} matrix - 畳み込み行列
 * @param  {number} divisor - 除数
 * @param  {number} bias - バイアス
 * @param  {boolean} preserveAlpha - アルファを保持するか
 * @param  {boolean} clamp - 範囲外をクランプするか
 * @param  {number} color - 範囲外の色
 * @param  {number} alpha - 範囲外のアルファ
 * @param  {IConvolutionConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
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
    config: IConvolutionConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, textureManager } = config;

    const width = sourceAttachment.width;
    const height = sourceAttachment.height;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    // 動的にシェーダーを生成
    const fragmentShaderCode = ShaderSource.getConvolutionFilterFragmentShader(
        matrixX, matrixY, preserveAlpha, clamp
    );

    const vertexShaderModule = device.createShaderModule({
        code: ShaderSource.getBlurFilterVertexShader()
    });

    const fragmentShaderModule = device.createShaderModule({
        code: fragmentShaderCode
    });

    // マトリクスサイズを計算
    const matrixSize = matrixX * matrixY;
    const matrixArraySize = Math.ceil(matrixSize / 4);

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
    const sampler = textureManager.createSampler("convolution_sampler", true);

    // ユニフォームバッファを作成
    // rcpSize: vec2<f32> (8 bytes)
    // rcpDivisor: f32 (4 bytes)
    // bias: f32 (4 bytes)
    // substituteColor: vec4<f32> (16 bytes)
    // matrix: array<vec4<f32>, N> (N * 16 bytes)
    // Total: 32 + N * 16 bytes (16-byte alignment)
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
            { binding: 2, resource: sourceAttachment.texture!.view }
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

    return destAttachment;
};
