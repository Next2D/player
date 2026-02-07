import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IBlendMode } from "../../interface/IBlendMode";
import type { ILocalFilterConfig } from "../../interface/ILocalFilterConfig";
import type { BufferManager } from "../../BufferManager";
import { $offset } from "../../Filter/FilterOffset";
import { WebGPUUtil } from "../../WebGPUUtil";
import { $cacheStore } from "@next2d/cache";
import { execute as filterApplyBlurFilterUseCase } from "../../Filter/BlurFilter/FilterApplyBlurFilterUseCase";
import { execute as filterApplyColorMatrixFilterUseCase } from "../../Filter/ColorMatrixFilter/FilterApplyColorMatrixFilterUseCase";
import { execute as filterApplyGlowFilterUseCase } from "../../Filter/GlowFilter/FilterApplyGlowFilterUseCase";
import { execute as filterApplyDropShadowFilterUseCase } from "../../Filter/DropShadowFilter/FilterApplyDropShadowFilterUseCase";
import { execute as filterApplyBevelFilterUseCase } from "../../Filter/BevelFilter/FilterApplyBevelFilterUseCase";
import { execute as filterApplyConvolutionFilterUseCase } from "../../Filter/ConvolutionFilter/FilterApplyConvolutionFilterUseCase";
import { execute as filterApplyGradientBevelFilterUseCase } from "../../Filter/GradientBevelFilter/FilterApplyGradientBevelFilterUseCase";
import { execute as filterApplyGradientGlowFilterUseCase } from "../../Filter/GradientGlowFilter/FilterApplyGradientGlowFilterUseCase";
import { execute as filterApplyDisplacementMapFilterUseCase } from "../../Filter/DisplacementMapFilter/FilterApplyDisplacementMapFilterUseCase";
import { execute as blendApplyComplexBlendUseCase } from "../../Blend/usecase/BlendApplyComplexBlendUseCase";

/**
 * @description シンプルなブレンドモード
 */
const SIMPLE_BLEND_MODES: ReadonlySet<IBlendMode> = new Set([
    "normal", "layer", "add", "screen", "alpha", "erase", "copy"
] as IBlendMode[]);

/**
 * @description 恒等カラートランスフォーム
 */
const $identityColorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

/**
 * @description コンテナの一時アタッチメント(bgra8unorm)から領域をフィルター用(rgba8unorm)にコピー
 *
 * @param {ILocalFilterConfig} config
 * @param {IAttachmentObject} srcAttachment - コンテナの一時アタッチメント(bgra8unorm)
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @return {IAttachmentObject}
 */
const copyRegionToFilterAttachment = (
    config: ILocalFilterConfig,
    srcAttachment: IAttachmentObject,
    x: number,
    y: number,
    width: number,
    height: number
): IAttachmentObject => {

    const dstAttachment = config.frameBufferManager.createTemporaryAttachment(width, height);

    const pipeline = config.pipelineManager.getPipeline("complex_blend_copy");
    const bindGroupLayout = config.pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout || !srcAttachment.texture || !dstAttachment.texture) {
        return dstAttachment;
    }

    const scaleX = width / srcAttachment.width;
    const scaleY = height / srcAttachment.height;
    const offsetX = x / srcAttachment.width;
    const offsetY = y / srcAttachment.height;

    const uniformData = new Float32Array([scaleX, scaleY, offsetX, offsetY]);
    const uniformBuffer = config.bufferManager.acquireUniformBuffer(16);
    config.device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    const sampler = config.textureManager.createSampler("container_copy_sampler", false);
    const bindGroup = config.device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [
            { "binding": 0, "resource": { "buffer": uniformBuffer } },
            { "binding": 1, "resource": sampler },
            { "binding": 2, "resource": srcAttachment.texture.view }
        ]
    });

    const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
        dstAttachment.texture.view, 0, 0, 0, 0, "clear"
    );

    const passEncoder = config.commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    return dstAttachment;
};

/**
 * @description フィルター結果をメインアタッチメントに描画
 *
 * @param {ILocalFilterConfig} config
 * @param {IAttachmentObject} filterAttachment - rgba8unormフィルター結果
 * @param {IAttachmentObject} mainAttachment - 描画先メインアタッチメント
 * @param {IBlendMode} blendMode
 * @param {number} x
 * @param {number} y
 * @param {BufferManager} bufferManager
 * @return {void}
 */
const drawFilterResultToMain = (
    config: ILocalFilterConfig,
    filterAttachment: IAttachmentObject,
    mainAttachment: IAttachmentObject,
    blendMode: IBlendMode,
    x: number,
    y: number,
    bufferManager: BufferManager
): void => {

    if (!mainAttachment.texture || !filterAttachment.texture) {
        return;
    }

    let drawX = Math.floor(x);
    let drawY = Math.floor(y);
    let drawWidth = filterAttachment.width;
    let drawHeight = filterAttachment.height;

    let uvOffsetX = 0;
    let uvOffsetY = 0;
    if (drawX < 0) {
        uvOffsetX = -drawX / filterAttachment.width;
        drawWidth += drawX;
        drawX = 0;
    }
    if (drawY < 0) {
        uvOffsetY = -drawY / filterAttachment.height;
        drawHeight += drawY;
        drawY = 0;
    }

    if (drawWidth <= 0 || drawHeight <= 0) {
        return;
    }

    const mainWidth = mainAttachment.width;
    const mainHeight = mainAttachment.height;
    if (drawX + drawWidth > mainWidth) {
        drawWidth = mainWidth - drawX;
    }
    if (drawY + drawHeight > mainHeight) {
        drawHeight = mainHeight - drawY;
    }

    if (SIMPLE_BLEND_MODES.has(blendMode)) {

        const useMsaa = mainAttachment.msaa && mainAttachment.msaaTexture?.view;

        let pipelineName: string;
        switch (blendMode) {
            case "add":
                pipelineName = useMsaa ? "filter_output_add_msaa" : "filter_output_add";
                break;
            case "screen":
                pipelineName = useMsaa ? "filter_output_screen_msaa" : "filter_output_screen";
                break;
            case "alpha":
                pipelineName = useMsaa ? "filter_output_alpha_msaa" : "filter_output_alpha";
                break;
            case "erase":
                pipelineName = useMsaa ? "filter_output_erase_msaa" : "filter_output_erase";
                break;
            case "copy":
                pipelineName = useMsaa ? "texture_copy_bgra_msaa" : "texture_copy_bgra";
                break;
            default:
                pipelineName = useMsaa ? "filter_output_msaa" : "filter_output";
                break;
        }

        const pipeline = config.pipelineManager.getPipeline(pipelineName);
        const bindGroupLayout = config.pipelineManager.getBindGroupLayout("texture_copy");

        if (!pipeline || !bindGroupLayout) {
            return;
        }

        const sampler = config.textureManager.createSampler("container_output_sampler", true);

        const uvScaleX = 1 - uvOffsetX;
        const uvScaleY = 1 - uvOffsetY;
        const uniformData = new Float32Array([uvScaleX, uvScaleY, uvOffsetX, uvOffsetY]);
        const uniformBuffer = bufferManager.acquireUniformBuffer(16);
        config.device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

        const bindGroup = config.device.createBindGroup({
            "layout": bindGroupLayout,
            "entries": [
                { "binding": 0, "resource": { "buffer": uniformBuffer } },
                { "binding": 1, "resource": sampler },
                { "binding": 2, "resource": filterAttachment.texture.view }
            ]
        });

        const colorView = useMsaa ? mainAttachment.msaaTexture!.view : mainAttachment.texture.view;
        const resolveTarget = useMsaa ? mainAttachment.texture.view : null;
        const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
            colorView, 0, 0, 0, 0, "load", resolveTarget
        );

        const vpX = Math.max(0, Math.floor(drawX));
        const vpY = Math.max(0, Math.floor(drawY));
        const vpW = Math.max(1, filterAttachment.width);
        const vpH = Math.max(1, filterAttachment.height);
        const scissorW = Math.max(1, Math.min(vpW, mainWidth - vpX));
        const scissorH = Math.max(1, Math.min(vpH, mainHeight - vpY));

        if (scissorW <= 0 || scissorH <= 0 || vpX >= mainWidth || vpY >= mainHeight) {
            return;
        }

        const passEncoder = config.commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.setViewport(vpX, vpY, vpW, vpH, 0, 1);
        passEncoder.setScissorRect(vpX, vpY, scissorW, scissorH);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();

    } else {

        // 複雑なブレンドモード
        const dstAttachment = copyRegionToFilterAttachment(
            config, mainAttachment, drawX, drawY, drawWidth, drawHeight
        );

        const ct = new Float32Array([
            $identityColorTransform[0], $identityColorTransform[1],
            $identityColorTransform[2], $identityColorTransform[3],
            $identityColorTransform[4] / 255, $identityColorTransform[5] / 255,
            $identityColorTransform[6] / 255, 0
        ]);

        const blendedAttachment = blendApplyComplexBlendUseCase(
            filterAttachment, dstAttachment, blendMode, ct, {
                "device": config.device,
                "commandEncoder": config.commandEncoder,
                "bufferManager": config.bufferManager,
                "frameBufferManager": config.frameBufferManager,
                "pipelineManager": config.pipelineManager,
                "textureManager": config.textureManager
            }
        );

        // 結果をメインに描画
        const useMsaa = mainAttachment.msaa && mainAttachment.msaaTexture?.view;
        const resultPipelineName = useMsaa ? "filter_complex_blend_output_msaa" : "filter_complex_blend_output";
        const resultPipeline = config.pipelineManager.getPipeline(resultPipelineName);
        const resultLayout = config.pipelineManager.getBindGroupLayout("positioned_texture");

        if (resultPipeline && resultLayout && blendedAttachment.texture && mainAttachment.texture) {

            const uniformData = new Float32Array([
                drawX, drawY,
                blendedAttachment.width, blendedAttachment.height,
                mainAttachment.width, mainAttachment.height,
                0, 0
            ]);
            const uniformBuffer = bufferManager.acquireUniformBuffer(32);
            config.device.queue.writeBuffer(uniformBuffer, 0, uniformData);

            const sampler = config.textureManager.createSampler("container_blend_output_sampler", false);

            const bindGroup = config.device.createBindGroup({
                "layout": resultLayout,
                "entries": [
                    { "binding": 0, "resource": { "buffer": uniformBuffer } },
                    { "binding": 1, "resource": sampler },
                    { "binding": 2, "resource": blendedAttachment.texture.view }
                ]
            });

            const colorView = useMsaa ? mainAttachment.msaaTexture!.view : mainAttachment.texture.view;
            const resolveTarget = useMsaa ? mainAttachment.texture.view : null;
            const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
                colorView, 0, 0, 0, 0, "load", resolveTarget
            );

            const passEncoder = config.commandEncoder.beginRenderPass(renderPassDescriptor);
            passEncoder.setPipeline(resultPipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.draw(6, 1, 0, 0);
            passEncoder.end();
        }

        config.frameBufferManager.releaseTemporaryAttachment(dstAttachment);
        config.frameBufferManager.releaseTemporaryAttachment(blendedAttachment);
    }
};

/**
 * @description フィルターチェーンを適用
 *
 * @param {IAttachmentObject} filterAttachment
 * @param {Float32Array} matrix
 * @param {Float32Array} params
 * @param {number} devicePixelRatio
 * @param {ILocalFilterConfig} config
 * @return {IAttachmentObject}
 */
const applyFilterChain = (
    filterAttachment: IAttachmentObject,
    matrix: Float32Array,
    params: Float32Array,
    devicePixelRatio: number,
    config: ILocalFilterConfig
): IAttachmentObject => {

    $offset.x = 0;
    $offset.y = 0;

    for (let idx = 0; params.length > idx; ) {
        const type = params[idx++];

        switch (type) {

            case 0: // BevelFilter
                {
                    const newAtt = filterApplyBevelFilterUseCase(
                        filterAttachment, matrix,
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], Boolean(params[idx++]),
                        devicePixelRatio, config
                    );
                    if (filterAttachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAtt;
                }
                break;

            case 1: // BlurFilter
                {
                    const newAtt = filterApplyBlurFilterUseCase(
                        filterAttachment, matrix,
                        params[idx++], params[idx++], params[idx++],
                        devicePixelRatio, config
                    );
                    if (filterAttachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAtt;
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
                    const newAtt = filterApplyColorMatrixFilterUseCase(
                        filterAttachment, colorMatrix, config
                    );
                    if (filterAttachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAtt;
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

                    const newAtt = filterApplyConvolutionFilterUseCase(
                        filterAttachment,
                        convMatrixX, convMatrixY, convMatrix,
                        params[idx++], params[idx++],
                        Boolean(params[idx++]), Boolean(params[idx++]),
                        params[idx++], params[idx++],
                        config
                    );
                    if (filterAttachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAtt;
                }
                break;

            case 4: // DisplacementMapFilter
                {
                    const dmLen = params[idx++];
                    const dmBuffer = new Uint8Array(dmLen);
                    for (let i = 0; i < dmLen; i++) {
                        dmBuffer[i] = params[idx++];
                    }

                    const newAtt = filterApplyDisplacementMapFilterUseCase(
                        filterAttachment, matrix,
                        dmBuffer, params[idx++], params[idx++],
                        params[idx++], params[idx++],
                        params[idx++], params[idx++],
                        params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++],
                        devicePixelRatio, config
                    );
                    if (filterAttachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAtt;
                }
                break;

            case 5: // DropShadowFilter
                {
                    const newAtt = filterApplyDropShadowFilterUseCase(
                        filterAttachment, matrix,
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        Boolean(params[idx++]), Boolean(params[idx++]), Boolean(params[idx++]),
                        devicePixelRatio, config
                    );
                    if (filterAttachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAtt;
                }
                break;

            case 6: // GlowFilter
                {
                    const newAtt = filterApplyGlowFilterUseCase(
                        filterAttachment, matrix,
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++],
                        Boolean(params[idx++]), Boolean(params[idx++]),
                        devicePixelRatio, config
                    );
                    if (filterAttachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAtt;
                }
                break;

            case 7: // GradientBevelFilter
                {
                    const gbDist = params[idx++];
                    const gbAngle = params[idx++];

                    const gbColorsLen = params[idx++];
                    const gbColors = new Float32Array(gbColorsLen);
                    for (let i = 0; i < gbColorsLen; i++) gbColors[i] = params[idx++];

                    const gbAlphasLen = params[idx++];
                    const gbAlphas = new Float32Array(gbAlphasLen);
                    for (let i = 0; i < gbAlphasLen; i++) gbAlphas[i] = params[idx++];

                    const gbRatiosLen = params[idx++];
                    const gbRatios = new Float32Array(gbRatiosLen);
                    for (let i = 0; i < gbRatiosLen; i++) gbRatios[i] = params[idx++];

                    const newAtt = filterApplyGradientBevelFilterUseCase(
                        filterAttachment, matrix,
                        gbDist, gbAngle, gbColors, gbAlphas, gbRatios,
                        params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], Boolean(params[idx++]),
                        devicePixelRatio, config
                    );
                    if (filterAttachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAtt;
                }
                break;

            case 8: // GradientGlowFilter
                {
                    const ggDist = params[idx++];
                    const ggAngle = params[idx++];

                    const ggColorsLen = params[idx++];
                    const ggColors = new Float32Array(ggColorsLen);
                    for (let i = 0; i < ggColorsLen; i++) ggColors[i] = params[idx++];

                    const ggAlphasLen = params[idx++];
                    const ggAlphas = new Float32Array(ggAlphasLen);
                    for (let i = 0; i < ggAlphasLen; i++) ggAlphas[i] = params[idx++];

                    const ggRatiosLen = params[idx++];
                    const ggRatios = new Float32Array(ggRatiosLen);
                    for (let i = 0; i < ggRatiosLen; i++) ggRatios[i] = params[idx++];

                    const newAtt = filterApplyGradientGlowFilterUseCase(
                        filterAttachment, matrix,
                        ggDist, ggAngle, ggColors, ggAlphas, ggRatios,
                        params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], Boolean(params[idx++]),
                        devicePixelRatio, config
                    );
                    if (filterAttachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAtt;
                }
                break;
        }
    }

    return filterAttachment;
};

/**
 * @description コンテナのフィルター/ブレンド用レイヤーを終了し、結果を元のメインに合成
 *              End the container layer and composite the result back to the original main
 *
 * @param {IAttachmentObject} tempAttachment - コンテナの一時アタッチメント(bgra8unorm)
 * @param {IAttachmentObject} mainAttachment - 復元済みの元のメインアタッチメント
 * @param {string} tempName - 一時アタッチメントの名前（destroyAttachment用）
 * @param {IBlendMode} blendMode
 * @param {boolean} useFilter
 * @param {Float32Array | null} matrix
 * @param {Float32Array | null} filterBounds
 * @param {Float32Array | null} params
 * @param {ILocalFilterConfig} config
 * @param {BufferManager} bufferManager
 * @return {void}
 */
export const execute = (
    tempAttachment: IAttachmentObject,
    mainAttachment: IAttachmentObject,
    tempName: string,
    blendMode: IBlendMode,
    useFilter: boolean,
    matrix: Float32Array | null,
    filterBounds: Float32Array | null,
    params: Float32Array | null,
    config: ILocalFilterConfig,
    bufferManager: BufferManager,
    filter_key: string,
    updated: boolean
): void => {

    if (useFilter && matrix && filterBounds && params) {

        // キャッシュ判定
        const matrixKey = $cacheStore.generateFilterKeys(
            matrix[0], matrix[1], matrix[2], matrix[3]
        );

        let useCache = false;
        let filterAttachment: IAttachmentObject | null = null;

        if (filter_key) {
            const cachedKey = $cacheStore.get(filter_key, "fKey");
            if (cachedKey === matrixKey) {
                const cachedAttachment = $cacheStore.get(filter_key, "fTexture") as IAttachmentObject;
                if (updated) {
                    // キャッシュ無効化：古いアタッチメントを解放
                    if (cachedAttachment) {
                        config.frameBufferManager.releaseTemporaryAttachment(cachedAttachment);
                    }
                } else if (cachedAttachment) {
                    // キャッシュヒット：フィルターチェーンをスキップ
                    useCache = true;
                    filterAttachment = cachedAttachment;
                    $offset.x = $cacheStore.get(filter_key, "offsetX") || 0;
                    $offset.y = $cacheStore.get(filter_key, "offsetY") || 0;
                }
            }
        }

        // 一時アタッチメントを破棄（キャッシュヒット/ミスに関わらず必要）
        config.frameBufferManager.destroyAttachment(tempName);

        if (!useCache) {

            // コンテナの一時アタッチメント(bgra8unorm)からフィルター用(rgba8unorm)にコピー
            filterAttachment = copyRegionToFilterAttachment(
                config, tempAttachment, xMin, yMin, width, height
            );

            // フィルターチェーンを適用
            const devicePixelRatio = WebGPUUtil.getDevicePixelRatio();
            filterAttachment = applyFilterChain(
                filterAttachment, matrix, params, devicePixelRatio, config
            );

            // キャッシュに保存
            if (filter_key) {
                $cacheStore.set(filter_key, "fKey", matrixKey);
                $cacheStore.set(filter_key, "fTexture", filterAttachment);
                $cacheStore.set(filter_key, "offsetX", $offset.x);
                $cacheStore.set(filter_key, "offsetY", $offset.y);
            }
        }

        // フィルター結果をメインに描画
        if (filterAttachment) {
            const devicePixelRatio = WebGPUUtil.getDevicePixelRatio();
            const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
            const scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
            const boundsXMin = filterBounds[0] * (scaleX / devicePixelRatio);
            const boundsYMin = filterBounds[1] * (scaleY / devicePixelRatio);

            const drawX = xMin + boundsXMin - $offset.x;
            const drawY = yMin + boundsYMin - $offset.y;

            drawFilterResultToMain(
                config, filterAttachment, mainAttachment,
                blendMode, drawX, drawY, bufferManager
            );

            // キャッシュされていないアタッチメントのみ解放
            if (!filter_key) {
                config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
            }
        }

    } else {

        // ブレンドのみ：一時アタッチメント全体をフィルター用にコピーしてメインに描画
        const fullAttachment = copyRegionToFilterAttachment(
            config, tempAttachment,
            0, 0, tempAttachment.width, tempAttachment.height
        );

        // 一時アタッチメントを破棄
        config.frameBufferManager.destroyAttachment(tempName);

        drawFilterResultToMain(
            config, fullAttachment, mainAttachment,
            blendMode, 0, 0, bufferManager
        );

        config.frameBufferManager.releaseTemporaryAttachment(fullAttachment);
    }
};
