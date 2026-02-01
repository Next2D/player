import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { getComplexBlendQueue, clearComplexBlendQueue } from "../../Blend/BlendInstancedManager";
import { execute as blendApplyComplexBlendUseCase } from "../../Blend/usecase/BlendApplyComplexBlendUseCase";
import { $getAtlasAttachmentObject } from "../../AtlasManager";

/**
 * @description レンダーパスベースでテクスチャ領域をコピー
 *              Copy texture region using render pass (for format conversion)
 *
 * @param {GPUDevice} device
 * @param {GPUCommandEncoder} commandEncoder
 * @param {GPUTextureView} srcView - ソーステクスチャビュー
 * @param {IAttachmentObject} dstAttachment - デスティネーションアタッチメント
 * @param {number} srcX - ソースX座標
 * @param {number} srcY - ソースY座標
 * @param {number} srcWidth - ソーステクスチャ幅
 * @param {number} srcHeight - ソーステクスチャ高さ
 * @param {number} copyWidth - コピー幅
 * @param {number} copyHeight - コピー高さ
 * @param {FrameBufferManager} frameBufferManager
 * @param {TextureManager} textureManager
 * @param {PipelineManager} pipelineManager
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
    pipelineManager: PipelineManager
): void => {
    const pipeline = pipelineManager.getPipeline("texture_copy_rgba8");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU] texture_copy_rgba8 pipeline not found");
        return;
    }

    // ユニフォームバッファ: scale (vec2) + offset (vec2)
    const scaleX = copyWidth / srcWidth;
    const scaleY = copyHeight / srcHeight;
    const offsetX = srcX / srcWidth;
    const offsetY = srcY / srcHeight;

    const uniformData = new Float32Array([scaleX, scaleY, offsetX, offsetY]);
    const uniformBuffer = device.createBuffer({
        "size": 16,
        "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
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
 *
 * @param {GPUDevice} device
 * @param {GPUCommandEncoder} commandEncoder
 * @param {IAttachmentObject} srcAttachment - ソースアタッチメント（ブレンド結果）
 * @param {IAttachmentObject} mainAttachment - メインアタッチメント
 * @param {number} dstX - 描画先X座標
 * @param {number} dstY - 描画先Y座標
 * @param {FrameBufferManager} frameBufferManager
 * @param {TextureManager} textureManager
 * @param {PipelineManager} pipelineManager
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
    pipelineManager: PipelineManager
): void => {
    // 位置変換付きテクスチャ描画パイプラインを使用
    const pipeline = pipelineManager.getPipeline("positioned_texture");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("positioned_texture");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU] positioned_texture pipeline not found");
        return;
    }

    // ユニフォームデータ: offset, size, viewport, padding
    // シェーダーで頂点位置を計算: vertex * size + offset -> NDC変換
    const uniformData = new Float32Array([
        dstX, dstY,                               // offset (描画位置)
        srcAttachment.width, srcAttachment.height, // size (テクスチャサイズ)
        mainAttachment.width, mainAttachment.height, // viewport (ビューポートサイズ)
        0, 0                                       // padding (16バイトアライメント)
    ]);
    const uniformBuffer = device.createBuffer({
        "size": 32, // 8 floats * 4 bytes
        "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
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

    // メインアタッチメントへの描画（loadで既存内容を保持）
    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        mainAttachment.texture!.view,
        0, 0, 0, 0,
        "load"
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
 *
 * @param {GPUDevice} device
 * @param {GPUCommandEncoder} commandEncoder
 * @param {IAttachmentObject | null} mainAttachment - メインアタッチメント
 * @param {FrameBufferManager} frameBufferManager
 * @param {TextureManager} textureManager
 * @param {PipelineManager} pipelineManager
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    mainAttachment: IAttachmentObject | null,
    frameBufferManager: FrameBufferManager,
    textureManager: TextureManager,
    pipelineManager: PipelineManager
): void => {
    const queue = getComplexBlendQueue();

    if (queue.length === 0) {
        return;
    }

    if (!mainAttachment || !mainAttachment.texture) {
        clearComplexBlendQueue();
        return;
    }

    // 複数アトラス対応
    // AtlasManagerから取得、フォールバックとしてFrameBufferManagerから取得
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

        // 描画範囲がメインアタッチメントを超える場合はスキップ
        if (dstX >= mainAttachment.width || dstY >= mainAttachment.height) {
            continue;
        }

        // 統一サイズを使用（ソースとデスティネーションで同じサイズ）
        const blendWidth = node.w;
        const blendHeight = node.h;

        // メインアタッチメントの境界をチェック
        const clippedWidth = Math.min(blendWidth, mainAttachment.width - dstX);
        const clippedHeight = Math.min(blendHeight, mainAttachment.height - dstY);
        if (clippedWidth <= 0 || clippedHeight <= 0) {
            continue;
        }

        // 1. ソーステクスチャを作成（アトラスからコピー - 両方rgba8unorm）
        const srcAttachment = frameBufferManager.createTemporaryAttachment(blendWidth, blendHeight);
        commandEncoder.copyTextureToTexture(
            {
                "texture": atlasAttachment.texture.resource,
                "origin": { "x": node.x, "y": node.y, "z": 0 }
            },
            {
                "texture": srcAttachment.texture!.resource,
                "origin": { "x": 0, "y": 0, "z": 0 }
            },
            {
                "width": blendWidth,
                "height": blendHeight
            }
        );

        // 2. デスティネーションテクスチャを作成（ソースと同じサイズ）
        //    メインアタッチメント(bgra8unorm)からレンダーパスでコピー(rgba8unorm)
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
            pipelineManager
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
            pipelineManager
        );

        // 6. 一時テクスチャを解放
        frameBufferManager.releaseTemporaryAttachment(srcAttachment);
        frameBufferManager.releaseTemporaryAttachment(dstAttachment);
        frameBufferManager.releaseTemporaryAttachment(blendedAttachment);
    }

    // キューをクリア
    clearComplexBlendQueue();
};
