import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { getComplexBlendQueue, clearComplexBlendQueue } from "../../Blend/BlendInstancedManager";
import { execute as blendApplyComplexBlendUseCase } from "../../Blend/usecase/BlendApplyComplexBlendUseCase";
import { $getAtlasAttachmentObject } from "../../AtlasManager";

/**
 * @description レンダーパスベースでテクスチャ領域をコピー
 *              Copy texture region using render pass (for format conversion)
 */
const copyTextureRegionViaRenderPass = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    srcView: GPUTextureView,
    dstAttachment: IAttachmentObject,
    srcX: number,
    srcY: number,
    srcWidth: number,
    srcHeight: number,
    copyWidth: number,
    copyHeight: number,
    frameBufferManager: FrameBufferManager,
    textureManager: TextureManager,
    pipelineManager: PipelineManager,
    bufferManager: BufferManager
): void => {
    const pipeline = pipelineManager.getPipeline("complex_blend_copy");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout) {
        return;
    }

    const scaleX = copyWidth / srcWidth;
    const scaleY = copyHeight / srcHeight;
    const offsetX = srcX / srcWidth;
    const offsetY = srcY / srcHeight;

    const uniformData = new Float32Array([scaleX, scaleY, offsetX, offsetY]);
    const uniformBuffer = bufferManager.acquireUniformBuffer(16);
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    const sampler = textureManager.createSampler("complex_blend_copy_sampler", false);

    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [
            { "binding": 0, "resource": { "buffer": uniformBuffer } },
            { "binding": 1, "resource": sampler },
            { "binding": 2, "resource": srcView }
        ]
    });

    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        dstAttachment.texture!.view,
        0, 0, 0, 0,
        "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();
};

/**
 * @description 結果をmainAttachmentにレンダーパスで描画（アルファブレンド）
 *              位置変換付きシェーダーを使用して指定位置に描画
 */
const drawToMainAttachment = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    srcAttachment: IAttachmentObject,
    mainAttachment: IAttachmentObject,
    dstX: number,
    dstY: number,
    frameBufferManager: FrameBufferManager,
    textureManager: TextureManager,
    pipelineManager: PipelineManager,
    bufferManager: BufferManager
): void => {
    const useMsaa = mainAttachment.msaa && mainAttachment.msaaTexture?.view;
    const pipelineName = useMsaa ? "complex_blend_output_msaa" : "complex_blend_output";
    const pipeline = pipelineManager.getPipeline(pipelineName);
    const bindGroupLayout = pipelineManager.getBindGroupLayout("positioned_texture");

    if (!pipeline || !bindGroupLayout) {
        return;
    }

    const uniformData = new Float32Array([
        dstX, dstY,
        srcAttachment.width, srcAttachment.height,
        mainAttachment.width, mainAttachment.height,
        0, 0
    ]);
    const uniformBuffer = bufferManager.acquireUniformBuffer(32);
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    const sampler = textureManager.createSampler("complex_blend_output_sampler", false);

    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [
            { "binding": 0, "resource": { "buffer": uniformBuffer } },
            { "binding": 1, "resource": sampler },
            { "binding": 2, "resource": srcAttachment.texture!.view }
        ]
    });

    const colorView = useMsaa ? mainAttachment.msaaTexture!.view : mainAttachment.texture!.view;
    const resolveTarget = useMsaa ? mainAttachment.texture!.view : null;
    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        colorView,
        0, 0, 0, 0,
        "load",
        resolveTarget
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();
};

/**
 * @description 複雑なブレンドモードのキューを処理
 *              Process complex blend mode queue
 */
export const execute = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    mainAttachment: IAttachmentObject | null,
    frameBufferManager: FrameBufferManager,
    textureManager: TextureManager,
    pipelineManager: PipelineManager,
    bufferManager: BufferManager
): void => {
    const queue = getComplexBlendQueue();

    if (queue.length === 0) {
        return;
    }

    if (!mainAttachment || !mainAttachment.texture) {
        clearComplexBlendQueue();
        return;
    }

    const atlasAttachment = $getAtlasAttachmentObject() || frameBufferManager.getAttachment("atlas");
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

        if (dstX >= mainAttachment.width || dstY >= mainAttachment.height) {
            continue;
        }

        const hasScale = matrix[0] !== 1 || matrix[1] !== 0 || matrix[3] !== 0 || matrix[4] !== 1;

        const blendWidth = hasScale ? width : node.w;
        const blendHeight = hasScale ? height : node.h;

        const clippedWidth = Math.min(blendWidth, mainAttachment.width - dstX);
        const clippedHeight = Math.min(blendHeight, mainAttachment.height - dstY);
        if (clippedWidth <= 0 || clippedHeight <= 0) {
            continue;
        }

        // 1. ソーステクスチャを作成
        let srcAttachment: IAttachmentObject;

        if (hasScale) {
            srcAttachment = frameBufferManager.createTemporaryAttachment(blendWidth, blendHeight);

            const scalePipeline = pipelineManager.getPipeline("complex_blend_scale");
            const scaleBindGroupLayout = pipelineManager.getBindGroupLayout("texture_scale");

            if (scalePipeline && scaleBindGroupLayout) {
                const halfW = blendWidth / 2;
                const halfH = blendHeight / 2;
                const halfNodeW = node.w / 2;
                const halfNodeH = node.h / 2;

                const tMatrix = new Float32Array([
                    matrix[0], matrix[1],
                    matrix[3], matrix[4],
                    -halfNodeW * matrix[0] - halfNodeH * matrix[3] + halfW,
                    -halfNodeW * matrix[1] - halfNodeH * matrix[4] + halfH
                ]);

                const originalAttachment = frameBufferManager.createTemporaryAttachment(node.w, node.h);
                commandEncoder.copyTextureToTexture(
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

                const uniformData = new Float32Array([
                    tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], tMatrix[4], tMatrix[5],
                    node.w, node.h,
                    blendWidth, blendHeight,
                    0, 0
                ]);
                const uniformBuffer = bufferManager.acquireUniformBuffer(48);
                device.queue.writeBuffer(uniformBuffer, 0, uniformData);

                const sampler = textureManager.createSampler("scale_sampler", true);
                const bindGroup = device.createBindGroup({
                    "layout": scaleBindGroupLayout,
                    "entries": [
                        { "binding": 0, "resource": { "buffer": uniformBuffer } },
                        { "binding": 1, "resource": sampler },
                        { "binding": 2, "resource": originalAttachment.texture!.view }
                    ]
                });

                const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
                    srcAttachment.texture!.view,
                    0, 0, 0, 0,
                    "clear"
                );

                const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
                passEncoder.setPipeline(scalePipeline);
                passEncoder.setBindGroup(0, bindGroup);
                passEncoder.draw(6, 1, 0, 0);
                passEncoder.end();

                frameBufferManager.releaseTemporaryAttachment(originalAttachment);
            } else {
                commandEncoder.copyTextureToTexture(
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
            srcAttachment = frameBufferManager.createTemporaryAttachment(blendWidth, blendHeight);
            commandEncoder.copyTextureToTexture(
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
        const dstAttachment = frameBufferManager.createTemporaryAttachment(blendWidth, blendHeight);

        copyTextureRegionViaRenderPass(
            device,
            commandEncoder,
            mainAttachment.texture.view,
            dstAttachment,
            dstX,
            dstY,
            mainAttachment.width,
            mainAttachment.height,
            blendWidth,
            blendHeight,
            frameBufferManager,
            textureManager,
            pipelineManager,
            bufferManager
        );

        // 3. カラートランスフォームを準備
        const ct = new Float32Array([
            color_transform[0],
            color_transform[1],
            color_transform[2],
            global_alpha,
            color_transform[4] / 255,
            color_transform[5] / 255,
            color_transform[6] / 255,
            0
        ]);

        // 4. 複雑なブレンドを適用
        const blendedAttachment = blendApplyComplexBlendUseCase(
            srcAttachment,
            dstAttachment,
            blend_mode,
            ct,
            {
                device,
                commandEncoder,
                bufferManager,
                frameBufferManager,
                pipelineManager,
                textureManager
            }
        );

        // 5. 結果をメインアタッチメントに描画
        drawToMainAttachment(
            device,
            commandEncoder,
            blendedAttachment,
            mainAttachment,
            dstX,
            dstY,
            frameBufferManager,
            textureManager,
            pipelineManager,
            bufferManager
        );

        // 6. 一時テクスチャを解放
        frameBufferManager.releaseTemporaryAttachment(srcAttachment);
        frameBufferManager.releaseTemporaryAttachment(dstAttachment);
        frameBufferManager.releaseTemporaryAttachment(blendedAttachment);
    }

    clearComplexBlendQueue();
};
