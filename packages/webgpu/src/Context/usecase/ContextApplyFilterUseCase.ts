import type { Node } from "@next2d/texture-packer";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IBlendMode } from "../../interface/IBlendMode";
import type { ILocalFilterConfig } from "../../interface/ILocalFilterConfig";
import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import { $getAtlasAttachmentObject } from "../../AtlasManager";
import { $offset } from "../../Filter/FilterOffset";
import { WebGPUUtil } from "../../WebGPUUtil";
import { execute as filterApplyBlurFilterUseCase } from "../../Filter/BlurFilter/FilterApplyBlurFilterUseCase";
import { execute as filterApplyColorMatrixFilterUseCase } from "../../Filter/ColorMatrixFilter/FilterApplyColorMatrixFilterUseCase";
import { execute as filterApplyGlowFilterUseCase } from "../../Filter/GlowFilter/FilterApplyGlowFilterUseCase";
import { execute as filterApplyDropShadowFilterUseCase } from "../../Filter/DropShadowFilter/FilterApplyDropShadowFilterUseCase";
import { execute as filterApplyBevelFilterUseCase } from "../../Filter/BevelFilter/FilterApplyBevelFilterUseCase";
import { execute as filterApplyConvolutionFilterUseCase } from "../../Filter/ConvolutionFilter/FilterApplyConvolutionFilterUseCase";
import { execute as filterApplyGradientBevelFilterUseCase } from "../../Filter/GradientBevelFilter/FilterApplyGradientBevelFilterUseCase";
import { execute as filterApplyGradientGlowFilterUseCase } from "../../Filter/GradientGlowFilter/FilterApplyGradientGlowFilterUseCase";
import { execute as filterApplyDisplacementMapFilterUseCase } from "../../Filter/DisplacementMapFilter/FilterApplyDisplacementMapFilterUseCase";

/**
 * @description ノードからテクスチャをアタッチメントとして取得
 *              Get texture from node as attachment
 *
 * @param {Node} node
 * @param {GPUCommandEncoder} commandEncoder
 * @param {FrameBufferManager} frameBufferManager
 * @return {IAttachmentObject}
 */
const getTextureFromNode = (
    node: Node,
    command_encoder: GPUCommandEncoder,
    frame_buffer_manager: FrameBufferManager
): IAttachmentObject => {
    // 一時アタッチメントを作成（ノードのサイズを使用）
    const attachment = frame_buffer_manager.createTemporaryAttachment(node.w, node.h);

    // アトラステクスチャから該当部分をコピー（複数アトラス対応）
    // AtlasManagerから取得、フォールバックとしてFrameBufferManagerから取得
    const atlasAttachment = $getAtlasAttachmentObject() || frame_buffer_manager.getAttachment("atlas");
    if (atlasAttachment && atlasAttachment.texture && attachment.texture) {
        // command_encoderを使ってコピー
        command_encoder.copyTextureToTexture(
            {
                "texture": atlasAttachment.texture.resource,
                "origin": { "x": node.x, "y": node.y, "z": 0 }
            },
            {
                "texture": attachment.texture.resource,
                "origin": { "x": 0, "y": 0, "z": 0 }
            },
            {
                "width": node.w,
                "height": node.h
            }
        );
    } else {
        console.error("[WebGPU Filter] getTextureFromNode: FAILED - missing atlas or textures");
    }

    return attachment;
};

/**
 * @description フィルター結果をメインアタッチメントに描画
 *              Draw filter result to main attachment (WebGL版と同じフロー)
 *
 * @param {ILocalFilterConfig} config
 * @param {IAttachmentObject} filterAttachment
 * @param {Float32Array} _colorTransform - 未使用（将来の拡張用）
 * @param {IBlendMode} _blendMode - 未使用（将来の拡張用）
 * @param {number} x
 * @param {number} y
 * @param {GPUTextureView} _mainTextureView - 未使用（メインアタッチメントに描画）
 * @param {BufferManager} _bufferManager - 未使用（将来の拡張用）
 * @return {void}
 */
const drawFilterToMain = (
    config: ILocalFilterConfig,
    filter_attachment: IAttachmentObject,
    _color_transform: Float32Array,
    _blend_mode: IBlendMode,
    x: number,
    y: number,
    _main_texture_view: GPUTextureView,
    _buffer_manager: BufferManager
): void => {
    // メインアタッチメントに描画
    const mainAttachment = config.frameBufferManager.getAttachment("main");
    if (!mainAttachment || !mainAttachment.texture || !filter_attachment.texture) {
        return;
    }

    // texture_copy_bgraパイプラインを使用
    const pipeline = config.pipelineManager.getPipeline("texture_copy_bgra");
    const bindGroupLayout = config.pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout) {
        return;
    }

    // サンプラーを作成
    const sampler = config.textureManager.createSampler("filter_output_sampler", true);

    // 描画位置とサイズを計算
    let drawX = Math.floor(x);
    let drawY = Math.floor(y);
    let drawWidth = filter_attachment.width;
    let drawHeight = filter_attachment.height;

    // UV座標のオフセット（描画位置が負の場合に調整）
    let uvOffsetX = 0;
    let uvOffsetY = 0;

    // 負の描画位置を処理（画面外の部分をクリップ）
    if (drawX < 0) {
        uvOffsetX = -drawX / filter_attachment.width;
        drawWidth += drawX;
        drawX = 0;
    }
    if (drawY < 0) {
        uvOffsetY = -drawY / filter_attachment.height;
        drawHeight += drawY;
        drawY = 0;
    }

    // 描画サイズが0以下なら描画しない
    if (drawWidth <= 0 || drawHeight <= 0) {
        return;
    }

    // メインアタッチメントの範囲内にクランプ
    const mainWidth = mainAttachment.width;
    const mainHeight = mainAttachment.height;
    if (drawX + drawWidth > mainWidth) {
        drawWidth = mainWidth - drawX;
    }
    if (drawY + drawHeight > mainHeight) {
        drawHeight = mainHeight - drawY;
    }

    // UV座標のスケール（クリップされた部分を考慮）
    const uvScaleX = drawWidth / filter_attachment.width;
    const uvScaleY = drawHeight / filter_attachment.height;

    // ユニフォーム: scale(2) + offset(2)
    const uniformData = new Float32Array([uvScaleX, uvScaleY, uvOffsetX, uvOffsetY]);

    // ユニフォームバッファを作成
    const uniformBuffer = config.device.createBuffer({
        "size": 16,
        "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    config.device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    const bindGroup = config.device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [
            { "binding": 0, "resource": { "buffer": uniformBuffer } },
            { "binding": 1, "resource": sampler },
            { "binding": 2, "resource": filter_attachment.texture.view }
        ]
    });

    // メインアタッチメントへのレンダーパス（既存コンテンツをロード）
    const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
        mainAttachment.texture.view,
        0, 0, 0, 0,
        "load"
    );

    const passEncoder = config.commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);

    // ビューポートとシザーを設定して、フィルター結果を正しい位置に描画
    passEncoder.setViewport(drawX, drawY, drawWidth, drawHeight, 0, 1);
    passEncoder.setScissorRect(drawX, drawY, drawWidth, drawHeight);

    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();
};

/**
 * @description フィルターを適用
 *              Apply filters
 *
 * @param {Node} node
 * @param {number} _width
 * @param {number} _height
 * @param {Float32Array} matrix
 * @param {Float32Array} colorTransform
 * @param {IBlendMode} blendMode
 * @param {Float32Array} bounds
 * @param {Float32Array} params
 * @param {ILocalFilterConfig} config
 * @param {GPUTextureView} mainTextureView
 * @param {BufferManager} bufferManager
 * @return {void}
 */
export const execute = (
    node: Node,
    _width: number,
    _height: number,
    matrix: Float32Array,
    color_transform: Float32Array,
    blend_mode: IBlendMode,
    bounds: Float32Array,
    params: Float32Array,
    config: ILocalFilterConfig,
    main_texture_view: GPUTextureView,
    buffer_manager: BufferManager
): void => {
    // オフセットを初期化
    $offset.x = 0;
    $offset.y = 0;

    // ノードからテクスチャを取得
    let filterAttachment = getTextureFromNode(node, config.commandEncoder, config.frameBufferManager);

    const devicePixelRatio = WebGPUUtil.getDevicePixelRatio();

    // フィルターを適用
    for (let idx = 0; params.length > idx; ) {
        const type = params[idx++];

        switch (type) {
            case 0: // BevelFilter
                {
                    const bevelDistance = params[idx++];
                    const bevelAngle = params[idx++];
                    const bevelHighlightColor = params[idx++];
                    const bevelHighlightAlpha = params[idx++];
                    const bevelShadowColor = params[idx++];
                    const bevelShadowAlpha = params[idx++];
                    const bevelBlurX = params[idx++];
                    const bevelBlurY = params[idx++];
                    const bevelStrength = params[idx++];
                    const bevelQuality = params[idx++];
                    const bevelType = params[idx++];
                    const bevelKnockout = Boolean(params[idx++]);

                    const newAttachment = filterApplyBevelFilterUseCase(
                        filterAttachment, matrix,
                        bevelDistance, bevelAngle,
                        bevelHighlightColor, bevelHighlightAlpha,
                        bevelShadowColor, bevelShadowAlpha,
                        bevelBlurX, bevelBlurY, bevelStrength, bevelQuality,
                        bevelType, bevelKnockout,
                        devicePixelRatio, config
                    );

                    if (filterAttachment !== newAttachment) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAttachment;
                }
                break;

            case 1: // BlurFilter
                {
                    const blurX = params[idx++];
                    const blurY = params[idx++];
                    const quality = params[idx++];

                    const newAttachment = filterApplyBlurFilterUseCase(
                        filterAttachment, matrix,
                        blurX, blurY, quality,
                        devicePixelRatio, config
                    );

                    if (filterAttachment !== newAttachment) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAttachment;
                }
                break;

            case 2: // ColorMatrixFilter
                {
                    const colorMatrix = new Float32Array([
                        params[idx++], params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++], params[idx++]
                    ]);

                    const newAttachment = filterApplyColorMatrixFilterUseCase(
                        filterAttachment, colorMatrix, config
                    );

                    if (filterAttachment !== newAttachment) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAttachment;
                }
                break;

            case 3: // ConvolutionFilter
                {
                    const convMatrixX = params[idx++];
                    const convMatrixY = params[idx++];
                    const convLength = convMatrixX * convMatrixY;
                    const convMatrix = new Float32Array(convLength);
                    for (let i = 0; i < convLength; i++) {
                        convMatrix[i] = params[idx++];
                    }
                    const convDivisor = params[idx++];
                    const convBias = params[idx++];
                    const convPreserveAlpha = Boolean(params[idx++]);
                    const convClamp = Boolean(params[idx++]);
                    const convColor = params[idx++];
                    const convAlpha = params[idx++];

                    const newAttachment = filterApplyConvolutionFilterUseCase(
                        filterAttachment,
                        convMatrixX, convMatrixY, convMatrix,
                        convDivisor, convBias, convPreserveAlpha, convClamp,
                        convColor, convAlpha,
                        config
                    );

                    if (filterAttachment !== newAttachment) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAttachment;
                }
                break;

            case 4: // DisplacementMapFilter
                {
                    const dmBufferLength = params[idx++];
                    const dmBuffer = new Uint8Array(dmBufferLength);
                    for (let i = 0; i < dmBufferLength; i++) {
                        dmBuffer[i] = params[idx++];
                    }

                    const dmBitmapWidth = params[idx++];
                    const dmBitmapHeight = params[idx++];
                    const dmMapPointX = params[idx++];
                    const dmMapPointY = params[idx++];
                    const dmComponentX = params[idx++];
                    const dmComponentY = params[idx++];
                    const dmScaleX = params[idx++];
                    const dmScaleY = params[idx++];
                    const dmMode = params[idx++];
                    const dmColor = params[idx++];
                    const dmAlpha = params[idx++];

                    const newAttachment = filterApplyDisplacementMapFilterUseCase(
                        filterAttachment, matrix,
                        dmBuffer, dmBitmapWidth, dmBitmapHeight,
                        dmMapPointX, dmMapPointY,
                        dmComponentX, dmComponentY,
                        dmScaleX, dmScaleY,
                        dmMode, dmColor, dmAlpha,
                        devicePixelRatio, config
                    );

                    if (filterAttachment !== newAttachment) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAttachment;
                }
                break;

            case 5: // DropShadowFilter
                {
                    const dsDistance = params[idx++];
                    const dsAngle = params[idx++];
                    const dsColor = params[idx++];
                    const dsAlpha = params[idx++];
                    const dsBlurX = params[idx++];
                    const dsBlurY = params[idx++];
                    const dsStrength = params[idx++];
                    const dsQuality = params[idx++];
                    const dsInner = Boolean(params[idx++]);
                    const dsKnockout = Boolean(params[idx++]);
                    const dsHideObject = Boolean(params[idx++]);

                    const newAttachment = filterApplyDropShadowFilterUseCase(
                        filterAttachment, matrix,
                        dsDistance, dsAngle, dsColor, dsAlpha,
                        dsBlurX, dsBlurY, dsStrength, dsQuality,
                        dsInner, dsKnockout, dsHideObject,
                        devicePixelRatio, config
                    );

                    if (filterAttachment !== newAttachment) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAttachment;
                }
                break;

            case 6: // GlowFilter
                {
                    const glowColor = params[idx++];
                    const glowAlpha = params[idx++];
                    const glowBlurX = params[idx++];
                    const glowBlurY = params[idx++];
                    const glowStrength = params[idx++];
                    const glowQuality = params[idx++];
                    const glowInner = Boolean(params[idx++]);
                    const glowKnockout = Boolean(params[idx++]);

                    const newAttachment = filterApplyGlowFilterUseCase(
                        filterAttachment, matrix,
                        glowColor, glowAlpha, glowBlurX, glowBlurY,
                        glowStrength, glowQuality, glowInner, glowKnockout,
                        devicePixelRatio, config
                    );

                    if (filterAttachment !== newAttachment) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAttachment;
                }
                break;

            case 7: // GradientBevelFilter
                {
                    const gbDistance = params[idx++];
                    const gbAngle = params[idx++];

                    const gbColorsLen = params[idx++];
                    const gbColors = new Float32Array(gbColorsLen);
                    for (let i = 0; i < gbColorsLen; i++) {
                        gbColors[i] = params[idx++];
                    }

                    const gbAlphasLen = params[idx++];
                    const gbAlphas = new Float32Array(gbAlphasLen);
                    for (let i = 0; i < gbAlphasLen; i++) {
                        gbAlphas[i] = params[idx++];
                    }

                    const gbRatiosLen = params[idx++];
                    const gbRatios = new Float32Array(gbRatiosLen);
                    for (let i = 0; i < gbRatiosLen; i++) {
                        gbRatios[i] = params[idx++];
                    }

                    const gbBlurX = params[idx++];
                    const gbBlurY = params[idx++];
                    const gbStrength = params[idx++];
                    const gbQuality = params[idx++];
                    const gbType = params[idx++];
                    const gbKnockout = Boolean(params[idx++]);

                    const newAttachment = filterApplyGradientBevelFilterUseCase(
                        filterAttachment, matrix,
                        gbDistance, gbAngle, gbColors, gbAlphas, gbRatios,
                        gbBlurX, gbBlurY, gbStrength, gbQuality, gbType, gbKnockout,
                        devicePixelRatio, config
                    );

                    if (filterAttachment !== newAttachment) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAttachment;
                }
                break;

            case 8: // GradientGlowFilter
                {
                    const ggDistance = params[idx++];
                    const ggAngle = params[idx++];

                    const ggColorsLen = params[idx++];
                    const ggColors = new Float32Array(ggColorsLen);
                    for (let i = 0; i < ggColorsLen; i++) {
                        ggColors[i] = params[idx++];
                    }

                    const ggAlphasLen = params[idx++];
                    const ggAlphas = new Float32Array(ggAlphasLen);
                    for (let i = 0; i < ggAlphasLen; i++) {
                        ggAlphas[i] = params[idx++];
                    }

                    const ggRatiosLen = params[idx++];
                    const ggRatios = new Float32Array(ggRatiosLen);
                    for (let i = 0; i < ggRatiosLen; i++) {
                        ggRatios[i] = params[idx++];
                    }

                    const ggBlurX = params[idx++];
                    const ggBlurY = params[idx++];
                    const ggStrength = params[idx++];
                    const ggQuality = params[idx++];
                    const ggType = params[idx++];
                    const ggKnockout = Boolean(params[idx++]);

                    const newAttachment = filterApplyGradientGlowFilterUseCase(
                        filterAttachment, matrix,
                        ggDistance, ggAngle, ggColors, ggAlphas, ggRatios,
                        ggBlurX, ggBlurY, ggStrength, ggQuality, ggType, ggKnockout,
                        devicePixelRatio, config
                    );

                    if (filterAttachment !== newAttachment) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAttachment;
                }
                break;
        }
    }

    // フィルター適用後のテクスチャをメインキャンバスに描画
    const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
    const xMin = bounds[0] * (scaleX / devicePixelRatio);
    const yMin = bounds[1] * (scaleY / devicePixelRatio);

    const drawX = -$offset.x + xMin + matrix[4];
    const drawY = -$offset.y + yMin + matrix[5];

    drawFilterToMain(
        config,
        filterAttachment,
        color_transform,
        blend_mode,
        drawX,
        drawY,
        main_texture_view,
        buffer_manager
    );

    // フィルター用アタッチメントを解放
    config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
};
