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
 * @param {readonly [number, number]} [dst_origin] - 解決済み背景の整数ピクセル原点。指定時の出力サイズはsrcと同じ。
 * @param {GPUTextureView} [dst_msaa_view] - 4x MSAA UNORM8背景。指定時は全画面resolveを省略できる。
 * @return {IAttachmentObject}
 */
export const execute = (
    src_attachment: IAttachmentObject,
    dst_attachment: IAttachmentObject,
    blend_mode: string,
    color_transform: Float32Array,
    config: IFilterConfig,
    dst_origin?: readonly [number, number],
    dst_msaa_view?: GPUTextureView
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 領域参照時は背景全体のサイズに拡張せず、ソースと同じ大きさで出力する。
    const width = dst_origin ? src_attachment.width : Math.max(src_attachment.width, dst_attachment.width);
    const height = dst_origin ? src_attachment.height : Math.max(src_attachment.height, dst_attachment.height);

    // 統一パイプラインを使用
    const useMsaa = !!dst_origin && !!dst_msaa_view;
    const pipeline = pipelineManager.getPipeline(useMsaa
        ? "complex_blend_region_msaa" : dst_origin ? "complex_blend_region" : "complex_blend");
    const bindGroupLayout = pipelineManager.getBindGroupLayout(useMsaa ? "complex_blend_msaa" : "complex_blend");

    if (!pipeline || !bindGroupLayout) {
        console.error(`[WebGPU ComplexBlend] Pipeline not found for blend mode: ${blend_mode}`);
        // フォールバック: srcをそのまま返す
        return src_attachment;
    }

    // 背景とは別のテクスチャに出力し、同一パスでの読み書き競合を避ける。
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    // サンプラーを作成
    const sampler = textureManager.createSampler("complex_blend_sampler", true);

    // ユニフォームバッファを作成
    // mulColor: vec4<f32> (16 bytes)
    // addColor: vec4<f32> (16 bytes)
    // blendMode, dstX, dstY, padding: 4 x f32 (16 bytes)
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
    $uniform12[9] = dst_origin?.[0] ?? 0;
    $uniform12[10] = dst_origin?.[1] ?? 0;
    $uniform12[11] = 0;

    let uniformBinding: GPUBufferBinding;
    if (config.bufferManager) {
        uniformBinding = config.bufferManager.allocateUniformBinding($uniform12);
    } else {
        const uniformBuffer = device.createBuffer({
            "size": 48,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(uniformBuffer, 0, $uniform12);
        uniformBinding = { "buffer": uniformBuffer, "offset": 0, "size": 48 };
    }

    // バインドグループを作成
    $entries4[0].resource = uniformBinding;
    $entries4[1].resource = sampler;
    $entries4[2].resource = useMsaa ? dst_msaa_view! : dst_attachment.texture!.view;
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
