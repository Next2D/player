import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { ShaderSource } from "../../Shader/ShaderSource";

/**
 * @description プリアロケートされた uniform データ (12 floats = 48 bytes)
 */
const $uniform12 = new Float32Array(12);

/**
 * @description プリアロケートされた BindGroupEntry 配列 (4 bindings)
 */
const $entries4: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView },
    { "binding": 3, "resource": null as unknown as GPUTextureView }
];

/**
 * @description 複雑なブレンドモードを適用
 */
export const execute = (
    srcAttachment: IAttachmentObject,
    dstAttachment: IAttachmentObject,
    blendMode: string,
    colorTransform: Float32Array,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 出力サイズは両方の大きい方を使用
    const width = Math.max(srcAttachment.width, dstAttachment.width);
    const height = Math.max(srcAttachment.height, dstAttachment.height);

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    // 統一パイプラインを使用
    const pipeline = pipelineManager.getPipeline("complex_blend");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("complex_blend");

    if (!pipeline || !bindGroupLayout) {
        console.error(`[WebGPU ComplexBlend] Pipeline not found for blend mode: ${blendMode}`);
        // フォールバック: srcをそのまま返す
        return srcAttachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("complex_blend_sampler", true);

    // ユニフォームバッファを作成
    // mulColor: vec4<f32> (16 bytes)
    // addColor: vec4<f32> (16 bytes)
    // blendMode: f32 + padding: vec3<f32> (16 bytes)
    // Total: 48 bytes
    const blendModeIndex = ShaderSource.getBlendModeIndex(blendMode);
    $uniform12[0] = colorTransform[0];
    $uniform12[1] = colorTransform[1];
    $uniform12[2] = colorTransform[2];
    $uniform12[3] = colorTransform[3];
    $uniform12[4] = colorTransform[4];
    $uniform12[5] = colorTransform[5];
    $uniform12[6] = colorTransform[6];
    $uniform12[7] = colorTransform[7];
    $uniform12[8] = blendModeIndex;
    $uniform12[9] = 0;
    $uniform12[10] = 0;
    $uniform12[11] = 0;

    const uniformBuffer = config.bufferManager
        ? config.bufferManager.acquireUniformBuffer(48)
        : device.createBuffer({
            "size": 48,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    device.queue.writeBuffer(uniformBuffer, 0, $uniform12);

    // バインドグループを作成
    ($entries4[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries4[1].resource = sampler;
    $entries4[2].resource = dstAttachment.texture!.view;
    $entries4[3].resource = srcAttachment.texture!.view;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries4
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

    return destAttachment;
};
