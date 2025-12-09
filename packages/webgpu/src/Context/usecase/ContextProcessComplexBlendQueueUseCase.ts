import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { getComplexBlendQueue, clearComplexBlendQueue } from "../../Blend/BlendInstancedManager";
import { execute as blendApplyComplexBlendUseCase } from "../../Blend/usecase/BlendApplyComplexBlendUseCase";

/**
 * @description 複雑なブレンドモードのキューを処理
 *              Process complex blend mode queue
 *
 * @param {GPUDevice} device
 * @param {GPUCommandEncoder} commandEncoder
 * @param {GPUTexture | null} mainTexture
 * @param {FrameBufferManager} frameBufferManager
 * @param {TextureManager} textureManager
 * @param {PipelineManager} pipelineManager
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    mainTexture: GPUTexture | null,
    frameBufferManager: FrameBufferManager,
    textureManager: TextureManager,
    pipelineManager: PipelineManager
): void => {
    const queue = getComplexBlendQueue();
    if (queue.length === 0) {
        return;
    }

    const atlasAttachment = frameBufferManager.getAttachment("atlas");
    if (!atlasAttachment) {
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

        // ソーステクスチャを作成（ノードからコピー）
        const srcAttachment = frameBufferManager.createTemporaryAttachment(node.w, node.h);
        commandEncoder.copyTextureToTexture(
            {
                texture: atlasAttachment.texture!.resource,
                origin: { x: node.x, y: node.y, z: 0 }
            },
            {
                texture: srcAttachment.texture!.resource,
                origin: { x: 0, y: 0, z: 0 }
            },
            {
                width: node.w,
                height: node.h
            }
        );

        // デスティネーションテクスチャを作成（現在の描画先からコピー）
        const dstX = Math.floor(matrix[6]);
        const dstY = Math.floor(matrix[7]);
        const dstAttachment = frameBufferManager.createTemporaryAttachment(width, height);

        // メインテクスチャから描画領域をコピー
        if (mainTexture && dstX >= 0 && dstY >= 0) {
            const copyWidth = Math.min(width, mainTexture.width - dstX);
            const copyHeight = Math.min(height, mainTexture.height - dstY);
            if (copyWidth > 0 && copyHeight > 0) {
                commandEncoder.copyTextureToTexture(
                    {
                        texture: mainTexture,
                        origin: { x: dstX, y: dstY, z: 0 }
                    },
                    {
                        texture: dstAttachment.texture!.resource,
                        origin: { x: 0, y: 0, z: 0 }
                    },
                    {
                        width: copyWidth,
                        height: copyHeight
                    }
                );
            }
        }

        // カラートランスフォームを準備
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

        // 複雑なブレンドを適用
        const blendedAttachment = blendApplyComplexBlendUseCase(
            srcAttachment,
            dstAttachment,
            blend_mode,
            ct,
            {
                device,
                commandEncoder,
                frameBufferManager,
                pipelineManager,
                textureManager
            }
        );

        // 結果をメインテクスチャにコピー
        if (mainTexture && dstX >= 0 && dstY >= 0) {
            const copyWidth = Math.min(blendedAttachment.width, mainTexture.width - dstX);
            const copyHeight = Math.min(blendedAttachment.height, mainTexture.height - dstY);
            if (copyWidth > 0 && copyHeight > 0) {
                commandEncoder.copyTextureToTexture(
                    {
                        texture: blendedAttachment.texture!.resource,
                        origin: { x: 0, y: 0, z: 0 }
                    },
                    {
                        texture: mainTexture,
                        origin: { x: dstX, y: dstY, z: 0 }
                    },
                    {
                        width: copyWidth,
                        height: copyHeight
                    }
                );
            }
        }

        // 一時テクスチャを解放
        frameBufferManager.releaseTemporaryAttachment(srcAttachment);
        frameBufferManager.releaseTemporaryAttachment(dstAttachment);
        frameBufferManager.releaseTemporaryAttachment(blendedAttachment);
    }

    // キューをクリア
    clearComplexBlendQueue();
};
