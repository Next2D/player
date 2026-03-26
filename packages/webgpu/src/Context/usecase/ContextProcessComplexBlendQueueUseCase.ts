import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { getComplexBlendQueue, clearComplexBlendQueue } from "../../Blend/BlendInstancedManager";
import { execute as blendApplyComplexBlendUseCase } from "../../Blend/usecase/BlendApplyComplexBlendUseCase";
import { $getAtlasAttachmentObject } from "../../AtlasManager";

// プリアロケート配列
/**
 * @description ユニフォームデータの事前確保配列（4要素）
 *              Pre-allocated uniform data array (4 elements)
 */
const $uniform4 = new Float32Array(4);
/**
 * @description ユニフォームデータの事前確保配列（6要素）
 *              Pre-allocated uniform data array (6 elements)
 */
const $uniform6 = new Float32Array(6);
/**
 * @description ユニフォームデータの事前確保配列（8要素）
 *              Pre-allocated uniform data array (8 elements)
 */
const $uniform8 = new Float32Array(8);
/**
 * @description ユニフォームデータの事前確保配列（12要素）
 *              Pre-allocated uniform data array (12 elements)
 */
const $uniform12 = new Float32Array(12);

// プリアロケート BindGroup Entry 配列
/**
 * @description バインドグループエントリの事前確保配列
 *              Pre-allocated bind group entry array
 */
const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];

/**
 * @description レンダーパスを使用してテクスチャ領域をコピーする
 *              Copies a texture region via render pass
 * @param {GPUDevice} device GPUデバイス / GPU device
 * @param {GPUCommandEncoder} command_encoder コマンドエンコーダ / Command encoder
 * @param {GPUTextureView} src_view ソーステクスチャビュー / Source texture view
 * @param {IAttachmentObject} dst_attachment デスティネーションアタッチメント / Destination attachment
 * @param {number} src_x ソースX座標 / Source X coordinate
 * @param {number} src_y ソースY座標 / Source Y coordinate
 * @param {number} src_width ソース幅 / Source width
 * @param {number} src_height ソース高さ / Source height
 * @param {number} copy_width コピー幅 / Copy width
 * @param {number} copy_height コピー高さ / Copy height
 * @param {FrameBufferManager} frame_buffer_manager フレームバッファマネージャ / Frame buffer manager
 * @param {TextureManager} texture_manager テクスチャマネージャ / Texture manager
 * @param {PipelineManager} pipeline_manager パイプラインマネージャ / Pipeline manager
 * @param {BufferManager} buffer_manager バッファマネージャ / Buffer manager
 * @return {void}
 */
const $copyTextureRegionViaRenderPass = (
    device: GPUDevice,
    command_encoder: GPUCommandEncoder,
    src_view: GPUTextureView,
    dst_attachment: IAttachmentObject,
    src_x: number,
    src_y: number,
    src_width: number,
    src_height: number,
    copy_width: number,
    copy_height: number,
    frame_buffer_manager: FrameBufferManager,
    texture_manager: TextureManager,
    pipeline_manager: PipelineManager,
    buffer_manager: BufferManager
): void => {
    const pipeline = pipeline_manager.getPipeline("complex_blend_copy");
    const bindGroupLayout = pipeline_manager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout) {
        return;
    }

    $uniform4[0] = copy_width / src_width;
    $uniform4[1] = copy_height / src_height;
    $uniform4[2] = src_x / src_width;
    $uniform4[3] = src_y / src_height;
    const uniformBuffer = buffer_manager.acquireAndWriteUniformBuffer($uniform4);

    const sampler = texture_manager.createSampler("complex_blend_copy_sampler", false);

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = src_view;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    const renderPassDescriptor = frame_buffer_manager.createRenderPassDescriptor(
        dst_attachment.texture!.view,
        0, 0, 0, 0,
        "clear"
    );

    const passEncoder = command_encoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();
};

/**
 * @description ブレンド結果をメインアタッチメントに描画する
 *              Draws blend result to the main attachment
 * @param {GPUDevice} device GPUデバイス / GPU device
 * @param {GPUCommandEncoder} command_encoder コマンドエンコーダ / Command encoder
 * @param {IAttachmentObject} src_attachment ソースアタッチメント / Source attachment
 * @param {IAttachmentObject} main_attachment メインアタッチメント / Main attachment
 * @param {number} dst_x デスティネーションX座標 / Destination X coordinate
 * @param {number} dst_y デスティネーションY座標 / Destination Y coordinate
 * @param {FrameBufferManager} frame_buffer_manager フレームバッファマネージャ / Frame buffer manager
 * @param {TextureManager} texture_manager テクスチャマネージャ / Texture manager
 * @param {PipelineManager} pipeline_manager パイプラインマネージャ / Pipeline manager
 * @param {BufferManager} buffer_manager バッファマネージャ / Buffer manager
 * @return {void}
 */
const $drawToMainAttachment = (
    device: GPUDevice,
    command_encoder: GPUCommandEncoder,
    src_attachment: IAttachmentObject,
    main_attachment: IAttachmentObject,
    dst_x: number,
    dst_y: number,
    frame_buffer_manager: FrameBufferManager,
    texture_manager: TextureManager,
    pipeline_manager: PipelineManager,
    buffer_manager: BufferManager
): void => {
    const useMsaa = main_attachment.msaa && main_attachment.msaaTexture?.view;
    const pipelineName = useMsaa ? "complex_blend_output_msaa" : "complex_blend_output";
    const pipeline = pipeline_manager.getPipeline(pipelineName);
    const bindGroupLayout = pipeline_manager.getBindGroupLayout("positioned_texture");

    if (!pipeline || !bindGroupLayout) {
        return;
    }

    $uniform8[0] = dst_x;
    $uniform8[1] = dst_y;
    $uniform8[2] = src_attachment.width;
    $uniform8[3] = src_attachment.height;
    $uniform8[4] = main_attachment.width;
    $uniform8[5] = main_attachment.height;
    $uniform8[6] = 0;
    $uniform8[7] = 0;
    const uniformBuffer = buffer_manager.acquireAndWriteUniformBuffer($uniform8);

    const sampler = texture_manager.createSampler("complex_blend_output_sampler", false);

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = src_attachment.texture!.view;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    const colorView = useMsaa ? main_attachment.msaaTexture!.view : main_attachment.texture!.view;
    const resolveTarget = useMsaa ? main_attachment.texture!.view : null;
    const renderPassDescriptor = frame_buffer_manager.createRenderPassDescriptor(
        colorView,
        0, 0, 0, 0,
        "load",
        resolveTarget
    );

    const passEncoder = command_encoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();
};

/**
 * @description 複雑なブレンドモードキューを処理する
 *              Processes the complex blend mode queue
 * @param {GPUDevice} device GPUデバイス / GPU device
 * @param {GPUCommandEncoder} command_encoder コマンドエンコーダ / Command encoder
 * @param {IAttachmentObject | null} main_attachment メインアタッチメント / Main attachment
 * @param {FrameBufferManager} frame_buffer_manager フレームバッファマネージャ / Frame buffer manager
 * @param {TextureManager} texture_manager テクスチャマネージャ / Texture manager
 * @param {PipelineManager} pipeline_manager パイプラインマネージャ / Pipeline manager
 * @param {BufferManager} buffer_manager バッファマネージャ / Buffer manager
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    command_encoder: GPUCommandEncoder,
    main_attachment: IAttachmentObject | null,
    frame_buffer_manager: FrameBufferManager,
    texture_manager: TextureManager,
    pipeline_manager: PipelineManager,
    buffer_manager: BufferManager
): void => {
    const queue = getComplexBlendQueue();

    if (queue.length === 0) {
        return;
    }

    if (!main_attachment || !main_attachment.texture) {
        clearComplexBlendQueue();
        return;
    }

    const atlasAttachment = $getAtlasAttachmentObject() || frame_buffer_manager.getAttachment("atlas");
    if (!atlasAttachment || !atlasAttachment.texture) {
        clearComplexBlendQueue();
        return;
    }

    for (const item of queue) {
        const { node, x_min, y_min, x_max, y_max, color_transform, matrix, blend_mode, global_alpha } = item;

        const width = Math.ceil(Math.abs(x_max - x_min));
        const height = Math.ceil(Math.abs(y_max - y_min));

        if (width <= 0 || height <= 0) {
            continue;
        }

        const dstX = Math.max(0, Math.floor(matrix[6]));
        const dstY = Math.max(0, Math.floor(matrix[7]));

        if (dstX >= main_attachment.width || dstY >= main_attachment.height) {
            continue;
        }

        const hasScale = matrix[0] !== 1 || matrix[1] !== 0 || matrix[3] !== 0 || matrix[4] !== 1;

        const blendWidth = hasScale ? width : node.w;
        const blendHeight = hasScale ? height : node.h;

        const clippedWidth = Math.min(blendWidth, main_attachment.width - dstX);
        const clippedHeight = Math.min(blendHeight, main_attachment.height - dstY);
        if (clippedWidth <= 0 || clippedHeight <= 0) {
            continue;
        }

        // 1. ソーステクスチャを作成
        let srcAttachment: IAttachmentObject;

        if (hasScale) {
            srcAttachment = frame_buffer_manager.createTemporaryAttachment(blendWidth, blendHeight);

            const scalePipeline = pipeline_manager.getPipeline("complex_blend_scale");
            const scaleBindGroupLayout = pipeline_manager.getBindGroupLayout("texture_scale");

            if (scalePipeline && scaleBindGroupLayout) {
                const halfW = blendWidth / 2;
                const halfH = blendHeight / 2;
                const halfNodeW = node.w / 2;
                const halfNodeH = node.h / 2;

                $uniform6[0] = matrix[0];
                $uniform6[1] = matrix[1];
                $uniform6[2] = matrix[3];
                $uniform6[3] = matrix[4];
                $uniform6[4] = -halfNodeW * matrix[0] - halfNodeH * matrix[3] + halfW;
                $uniform6[5] = -halfNodeW * matrix[1] - halfNodeH * matrix[4] + halfH;

                const originalAttachment = frame_buffer_manager.createTemporaryAttachment(node.w, node.h);
                command_encoder.copyTextureToTexture(
                    {
                        "texture": atlasAttachment.texture.resource,
                        "origin": { "x": node.x, "y": node.y, "z": 0 }
                    },
                    {
                        "texture": originalAttachment.texture!.resource,
                        "origin": { "x": 0, "y": 0, "z": 0 }
                    },
                    { "width": node.w, "height": node.h }
                );

                $uniform12[0] = $uniform6[0];
                $uniform12[1] = $uniform6[1];
                $uniform12[2] = $uniform6[2];
                $uniform12[3] = $uniform6[3];
                $uniform12[4] = $uniform6[4];
                $uniform12[5] = $uniform6[5];
                $uniform12[6] = node.w;
                $uniform12[7] = node.h;
                $uniform12[8] = blendWidth;
                $uniform12[9] = blendHeight;
                $uniform12[10] = 0;
                $uniform12[11] = 0;
                const uniformBuffer = buffer_manager.acquireAndWriteUniformBuffer($uniform12, 48);

                const sampler = texture_manager.createSampler("scale_sampler", true);
                ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
                $entries3[1].resource = sampler;
                $entries3[2].resource = originalAttachment.texture!.view;
                const bindGroup = device.createBindGroup({
                    "layout": scaleBindGroupLayout,
                    "entries": $entries3
                });

                const renderPassDescriptor = frame_buffer_manager.createRenderPassDescriptor(
                    srcAttachment.texture!.view,
                    0, 0, 0, 0,
                    "clear"
                );

                const passEncoder = command_encoder.beginRenderPass(renderPassDescriptor);
                passEncoder.setPipeline(scalePipeline);
                passEncoder.setBindGroup(0, bindGroup);
                passEncoder.draw(6, 1, 0, 0);
                passEncoder.end();

                frame_buffer_manager.releaseTemporaryAttachment(originalAttachment);
            } else {
                command_encoder.copyTextureToTexture(
                    {
                        "texture": atlasAttachment.texture.resource,
                        "origin": { "x": node.x, "y": node.y, "z": 0 }
                    },
                    {
                        "texture": srcAttachment.texture!.resource,
                        "origin": { "x": 0, "y": 0, "z": 0 }
                    },
                    { "width": Math.min(node.w, blendWidth), "height": Math.min(node.h, blendHeight) }
                );
            }
        } else {
            srcAttachment = frame_buffer_manager.createTemporaryAttachment(blendWidth, blendHeight);
            command_encoder.copyTextureToTexture(
                {
                    "texture": atlasAttachment.texture.resource,
                    "origin": { "x": node.x, "y": node.y, "z": 0 }
                },
                {
                    "texture": srcAttachment.texture!.resource,
                    "origin": { "x": 0, "y": 0, "z": 0 }
                },
                { "width": blendWidth, "height": blendHeight }
            );
        }

        // 2. デスティネーションテクスチャを作成（メインからレンダーパスでコピー）
        const dstAttachment = frame_buffer_manager.createTemporaryAttachment(blendWidth, blendHeight);

        $copyTextureRegionViaRenderPass(
            device,
            command_encoder,
            main_attachment.texture.view,
            dstAttachment,
            dstX,
            dstY,
            main_attachment.width,
            main_attachment.height,
            blendWidth,
            blendHeight,
            frame_buffer_manager,
            texture_manager,
            pipeline_manager,
            buffer_manager
        );

        // 3. カラートランスフォームを準備（add値は生値）
        $uniform8[0] = color_transform[0];
        $uniform8[1] = color_transform[1];
        $uniform8[2] = color_transform[2];
        $uniform8[3] = global_alpha;
        $uniform8[4] = color_transform[4];
        $uniform8[5] = color_transform[5];
        $uniform8[6] = color_transform[6];
        $uniform8[7] = 0;

        // 4. 複雑なブレンドを適用
        const blendedAttachment = blendApplyComplexBlendUseCase(
            srcAttachment,
            dstAttachment,
            blend_mode,
            $uniform8,
            {
                "device": device,
                "commandEncoder": command_encoder,
                "bufferManager": buffer_manager,
                "frameBufferManager": frame_buffer_manager,
                "pipelineManager": pipeline_manager,
                "textureManager": texture_manager,
                "frameTextures": []
            }
        );

        // 5. 結果をメインアタッチメントに描画
        $drawToMainAttachment(
            device,
            command_encoder,
            blendedAttachment,
            main_attachment,
            dstX,
            dstY,
            frame_buffer_manager,
            texture_manager,
            pipeline_manager,
            buffer_manager
        );

        // 6. 一時テクスチャを解放
        frame_buffer_manager.releaseTemporaryAttachment(srcAttachment);
        frame_buffer_manager.releaseTemporaryAttachment(dstAttachment);
        frame_buffer_manager.releaseTemporaryAttachment(blendedAttachment);
    }

    clearComplexBlendQueue();
};
