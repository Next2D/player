import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { ShaderSource } from "../../Shader/ShaderSource";

/**
 * @description プリアロケートされた uniform データ (12 floats = 48 bytes)
 *              Pre-allocated uniform data array (12 floats = 48 bytes)
 * @type {Float32Array}
 */
const $uniform12 = new Float32Array(12);

/**
 * @description プリアロケートされた BindGroupEntry 配列 (4 bindings)
 *              Pre-allocated BindGroupEntry array (4 bindings)
 * @type {GPUBindGroupEntry[]}
 */
const $entries4: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView },
    { "binding": 3, "resource": null as unknown as GPUTextureView }
];

/**
 * @description 複雑なブレンドモードを適用し、ブレンド結果のアタッチメントを返す
 *              Applies a complex blend mode and returns the resulting attachment
 * @param {IAttachmentObject} src_attachment - ソースアタッチメント / Source attachment
 * @param {IAttachmentObject} dst_attachment - デスティネーションアタッチメント / Destination attachment
 * @param {string} blend_mode - ブレンドモード名 / Blend mode name
 * @param {Float32Array} color_transform - カラートランスフォーム配列 / Color transform array
 * @param {IFilterConfig} config - フィルター設定 / Filter configuration
 * @return {IAttachmentObject}
 */
export const execute = (
    src_attachment: IAttachmentObject,
    dst_attachment: IAttachmentObject,
    blend_mode: string,
    color_transform: Float32Array,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 出力サイズは両方の大きい方を使用
    const width = Math.max(src_attachment.width, dst_attachment.width);
    const height = Math.max(src_attachment.height, dst_attachment.height);

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    // 統一パイプラインを使用
    const pipeline = pipelineManager.getPipeline("complex_blend");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("complex_blend");

    if (!pipeline || !bindGroupLayout) {
        console.error(`[WebGPU ComplexBlend] Pipeline not found for blend mode: ${blend_mode}`);
        // フォールバック: srcをそのまま返す
        return src_attachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("complex_blend_sampler", true);

    // ユニフォームバッファを作成
    // mulColor: vec4<f32> (16 bytes)
    // addColor: vec4<f32> (16 bytes)
    // blendMode: f32 + padding: vec3<f32> (16 bytes)
    // Total: 48 bytes
    const blendModeIndex = ShaderSource.getBlendModeIndex(blend_mode);
    $uniform12[0] = color_transform[0];
    $uniform12[1] = color_transform[1];
    $uniform12[2] = color_transform[2];
    $uniform12[3] = color_transform[3];
    $uniform12[4] = color_transform[4];
    $uniform12[5] = color_transform[5];
    $uniform12[6] = color_transform[6];
    $uniform12[7] = color_transform[7];
    $uniform12[8] = blendModeIndex;
    $uniform12[9] = 0;
    $uniform12[10] = 0;
    $uniform12[11] = 0;

    const uniformBuffer = config.bufferManager
        ? config.bufferManager.acquireAndWriteUniformBuffer($uniform12)
        : device.createBuffer({
            "size": 48,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    if (!config.bufferManager) {
        device.queue.writeBuffer(uniformBuffer, 0, $uniform12);
    }

    // バインドグループを作成
    ($entries4[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries4[1].resource = sampler;
    $entries4[2].resource = dst_attachment.texture!.view;
    $entries4[3].resource = src_attachment.texture!.view;
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
