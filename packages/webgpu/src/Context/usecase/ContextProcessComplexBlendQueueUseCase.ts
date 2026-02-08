import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { getComplexBlendQueue, clearComplexBlendQueue } from "../../Blend/BlendInstancedManager";
import { execute as blendApplyComplexBlendUseCase } from "../../Blend/usecase/BlendApplyComplexBlendUseCase";
import { $getAtlasAttachmentObject } from "../../AtlasManager";

// プリアロケート配列
const $uniform4 = new Float32Array(4);
const $uniform6 = new Float32Array(6);
const $uniform8 = new Float32Array(8);
const $uniform12 = new Float32Array(12);

// プリアロケート BindGroup Entry 配列
const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];

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

    $uniform4[0] = copyWidth / srcWidth;
    $uniform4[1] = copyHeight / srcHeight;
    $uniform4[2] = srcX / srcWidth;
    $uniform4[3] = srcY / srcHeight;
    const uniformBuffer = bufferManager.acquireUniformBuffer(16);
    device.queue.writeBuffer(uniformBuffer, 0, $uniform4);

    const sampler = textureManager.createSampler("complex_blend_copy_sampler", false);

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = srcView;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
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

    $uniform8[0] = dstX;
    $uniform8[1] = dstY;
    $uniform8[2] = srcAttachment.width;
    $uniform8[3] = srcAttachment.height;
    $uniform8[4] = mainAttachment.width;
    $uniform8[5] = mainAttachment.height;
    $uniform8[6] = 0;
    $uniform8[7] = 0;
    const uniformBuffer = bufferManager.acquireUniformBuffer(32);
    device.queue.writeBuffer(uniformBuffer, 0, $uniform8);

    const sampler = textureManager.createSampler("complex_blend_output_sampler", false);

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = srcAttachment.texture!.view;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
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

                $uniform6[0] = matrix[0];
                $uniform6[1] = matrix[1];
                $uniform6[2] = matrix[3];
                $uniform6[3] = matrix[4];
                $uniform6[4] = -halfNodeW * matrix[0] - halfNodeH * matrix[3] + halfW;
                $uniform6[5] = -halfNodeW * matrix[1] - halfNodeH * matrix[4] + halfH;

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
                const uniformBuffer = bufferManager.acquireUniformBuffer(48);
                device.queue.writeBuffer(uniformBuffer, 0, $uniform12);

                const sampler = textureManager.createSampler("scale_sampler", true);
                ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
                $entries3[1].resource = sampler;
                $entries3[2].resource = originalAttachment.texture!.view;
                const bindGroup = device.createBindGroup({
                    "layout": scaleBindGroupLayout,
                    "entries": $entries3
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
