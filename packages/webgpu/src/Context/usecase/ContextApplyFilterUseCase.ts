import type { Node } from "@next2d/texture-packer";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IBlendMode } from "../../interface/IBlendMode";
import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { $offset } from "../../Filter";
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
 * @description フィルター設定
 */
interface IFilterConfig {
    device: GPUDevice;
    commandEncoder: GPUCommandEncoder;
    frameBufferManager: FrameBufferManager;
    pipelineManager: PipelineManager;
    textureManager: TextureManager;
}

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
    commandEncoder: GPUCommandEncoder,
    frameBufferManager: FrameBufferManager
): IAttachmentObject => {
    // 一時アタッチメントを作成（ノードのサイズを使用）
    const attachment = frameBufferManager.createTemporaryAttachment(node.w, node.h);

    // アトラステクスチャから該当部分をコピー
    const atlasAttachment = frameBufferManager.getAttachment("atlas");
    if (atlasAttachment && atlasAttachment.texture && attachment.texture) {
        // commandEncoderを使ってコピー
        commandEncoder.copyTextureToTexture(
            {
                texture: atlasAttachment.texture.resource,
                origin: { x: node.x, y: node.y, z: 0 }
            },
            {
                texture: attachment.texture.resource,
                origin: { x: 0, y: 0, z: 0 }
            },
            {
                width: node.w,
                height: node.h
            }
        );
    }

    return attachment;
};

/**
 * @description フィルター結果をメインキャンバスに描画
 *              Draw filter result to main canvas
 *
 * @param {IFilterConfig} config
 * @param {IAttachmentObject} filterAttachment
 * @param {Float32Array} colorTransform
 * @param {IBlendMode} blendMode
 * @param {number} x
 * @param {number} y
 * @param {GPUTextureView} mainTextureView
 * @param {BufferManager} bufferManager
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @return {void}
 */
const drawFilterToMain = (
    config: IFilterConfig,
    filterAttachment: IAttachmentObject,
    colorTransform: Float32Array,
    _blendMode: IBlendMode,
    x: number,
    y: number,
    mainTextureView: GPUTextureView,
    bufferManager: BufferManager,
    canvasWidth: number,
    canvasHeight: number
): void => {
    // メインテクスチャにレンダリング
    const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
        mainTextureView,
        0, 0, 0, 0,
        "load"
    );

    const renderPassEncoder = config.commandEncoder.beginRenderPass(renderPassDescriptor);

    // インスタンス描画パイプラインを使用
    const pipeline = config.pipelineManager.getPipeline("instanced");
    if (!pipeline) {
        console.error("[WebGPU] Instanced pipeline not found for filter output");
        renderPassEncoder.end();
        return;
    }

    // フィルターテクスチャをサンプラーとバインドグループで描画
    const sampler = config.textureManager.createSampler("filter_output_sampler", false);
    const bindGroupLayout = config.pipelineManager.getBindGroupLayout("instanced");

    if (bindGroupLayout && filterAttachment.texture) {
        const bindGroup = config.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                { binding: 0, resource: sampler },
                { binding: 1, resource: filterAttachment.texture.view }
            ]
        });

        // シンプルな矩形描画
        const vertices = bufferManager.createRectVertices(0, 0, 1, 1);
        const vertexBuffer = bufferManager.createVertexBuffer(`filter_vertex_${Date.now()}`, vertices);

        // インスタンスデータ（1つのインスタンス）
        const instanceData = new Float32Array([
            // position (2)
            0, 0,
            // size (2)
            filterAttachment.width / canvasWidth * 2,
            filterAttachment.height / canvasHeight * 2,
            // offset (2) - NDC空間への変換
            (x / canvasWidth) * 2 - 1,
            1 - (y / canvasHeight) * 2,
            // texCoord (4)
            0, 0, 1, 1,
            // colorTransform (8)
            colorTransform[0], colorTransform[1], colorTransform[2], colorTransform[3],
            colorTransform[4], colorTransform[5], colorTransform[6], colorTransform[7]
        ]);

        const instanceBuffer = bufferManager.createVertexBuffer(`filter_instance_${Date.now()}`, instanceData);

        renderPassEncoder.setPipeline(pipeline);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        renderPassEncoder.setVertexBuffer(1, instanceBuffer);
        renderPassEncoder.setBindGroup(0, bindGroup);
        renderPassEncoder.draw(6, 1, 0, 0);
    }

    renderPassEncoder.end();
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
 * @param {IFilterConfig} config
 * @param {GPUTextureView} mainTextureView
 * @param {BufferManager} bufferManager
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @return {void}
 */
export const execute = (
    node: Node,
    _width: number,
    _height: number,
    matrix: Float32Array,
    colorTransform: Float32Array,
    blendMode: IBlendMode,
    bounds: Float32Array,
    params: Float32Array,
    config: IFilterConfig,
    mainTextureView: GPUTextureView,
    bufferManager: BufferManager,
    canvasWidth: number,
    canvasHeight: number
): void => {
    // オフセットを初期化
    $offset.x = 0;
    $offset.y = 0;

    // 描画元のテクスチャをアタッチメントとして取得
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

                    let gbColorsLen = params[idx++];
                    const gbColors = new Float32Array(gbColorsLen);
                    for (let i = 0; i < gbColorsLen; i++) {
                        gbColors[i] = params[idx++];
                    }

                    let gbAlphasLen = params[idx++];
                    const gbAlphas = new Float32Array(gbAlphasLen);
                    for (let i = 0; i < gbAlphasLen; i++) {
                        gbAlphas[i] = params[idx++];
                    }

                    let gbRatiosLen = params[idx++];
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

                    let ggColorsLen = params[idx++];
                    const ggColors = new Float32Array(ggColorsLen);
                    for (let i = 0; i < ggColorsLen; i++) {
                        ggColors[i] = params[idx++];
                    }

                    let ggAlphasLen = params[idx++];
                    const ggAlphas = new Float32Array(ggAlphasLen);
                    for (let i = 0; i < ggAlphasLen; i++) {
                        ggAlphas[i] = params[idx++];
                    }

                    let ggRatiosLen = params[idx++];
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

    drawFilterToMain(
        config,
        filterAttachment,
        colorTransform,
        blendMode,
        -$offset.x + xMin + matrix[4],
        -$offset.y + yMin + matrix[5],
        mainTextureView,
        bufferManager,
        canvasWidth,
        canvasHeight
    );

    // フィルター用アタッチメントを解放
    config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
};
