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
 * @description ユニフォームデータの事前確保配列（4要素）
 *              Pre-allocated uniform data array (4 elements)
 */
const $uniform4 = new Float32Array(4);
/**
 * @description ユニフォームデータの事前確保配列（8要素）
 *              Pre-allocated uniform data array (8 elements)
 */
const $uniform8 = new Float32Array(8);
/**
 * @description ユニフォームデータの事前確保配列（20要素）
 *              Pre-allocated uniform data array (20 elements)
 */
const $uniform20 = new Float32Array(20);

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
 * @description シンプルなブレンドモードのセット
 *              Set of simple blend modes
 */
const $SIMPLE_BLEND_MODES: ReadonlySet<IBlendMode> = new Set([
    "normal", "layer", "add", "screen", "alpha", "erase", "copy"
] as IBlendMode[]);

/**
 * @description 恒等カラートランスフォーム
 *              Identity color transform
 */
const $identityColorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

/**
 * @description カラートランスフォームが恒等変換かどうかを判定する
 *              Checks whether the color transform is an identity transform
 * @param {Float32Array | null} ct カラートランスフォーム配列 / Color transform array
 * @return {boolean} 恒等変換の場合true / True if identity transform
 */
const $isIdentityColorTransform = (ct: Float32Array | null): boolean => {
    if (!ct) {
        return true;
    }
    return ct[0] === 1 && ct[1] === 1 && ct[2] === 1 && ct[3] === 1
        && ct[4] === 0 && ct[5] === 0 && ct[6] === 0 && ct[7] === 0;
};

/**
 * @description アタッチメントにカラートランスフォームを適用する
 *              Applies color transform to an attachment
 * @param {ILocalFilterConfig} config フィルター設定 / Filter configuration
 * @param {IAttachmentObject} attachment ソースアタッチメント / Source attachment
 * @param {Float32Array} color_transform カラートランスフォーム配列 / Color transform array
 * @return {IAttachmentObject} カラートランスフォーム適用後のアタッチメント / Attachment with color transform applied
 */
const $applyColorTransform = (
    config: ILocalFilterConfig,
    attachment: IAttachmentObject,
    color_transform: Float32Array
): IAttachmentObject => {
    const ctAttachment = config.frameBufferManager.createTemporaryAttachment(
        attachment.width, attachment.height
    );

    const pipeline = config.pipelineManager.getPipeline("color_transform");
    const bindGroupLayout = config.pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout || !attachment.texture || !ctAttachment.texture) {
        return attachment;
    }

    $uniform8[0] = color_transform[0];
    $uniform8[1] = color_transform[1];
    $uniform8[2] = color_transform[2];
    $uniform8[3] = color_transform[3];
    $uniform8[4] = color_transform[4];
    $uniform8[5] = color_transform[5];
    $uniform8[6] = color_transform[6];
    $uniform8[7] = 0;
    const uniformBuffer = config.bufferManager.acquireAndWriteUniformBuffer($uniform8);

    const sampler = config.textureManager.createSampler("container_ct_sampler", false);

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = attachment.texture.view;
    const bindGroup = config.device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
        ctAttachment.texture.view, 0, 0, 0, 0, "clear"
    );

    const passEncoder = config.commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    return ctAttachment;
};

/**
 * @description ソースアタッチメントの領域をフィルター用アタッチメントにコピーする
 *              Copies a region from source attachment to a filter attachment
 * @param {ILocalFilterConfig} config フィルター設定 / Filter configuration
 * @param {IAttachmentObject} src_attachment ソースアタッチメント / Source attachment
 * @param {number} x X座標 / X coordinate
 * @param {number} y Y座標 / Y coordinate
 * @param {number} width 幅 / Width
 * @param {number} height 高さ / Height
 * @return {IAttachmentObject} コピーされたアタッチメント / Copied attachment
 */
const $copyRegionToFilterAttachment = (
    config: ILocalFilterConfig,
    src_attachment: IAttachmentObject,
    x: number,
    y: number,
    width: number,
    height: number
): IAttachmentObject => {

    const dstAttachment = config.frameBufferManager.createTemporaryAttachment(width, height);

    // texture_copy_rgba8 (BlurFilterVertex, yFlipTexCoord=true) を使用
    const pipeline = config.pipelineManager.getPipeline("texture_copy_rgba8");
    const bindGroupLayout = config.pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout || !src_attachment.texture || !dstAttachment.texture) {
        return dstAttachment;
    }

    // BlurFilterVertex (yFlipTexCoord=true):
    // texCoord.y=0(fb上端) → uv.y=y/H, texCoord.y=1(fb下端) → uv.y=(y+h)/H
    const scaleX = width / src_attachment.width;
    const scaleY = height / src_attachment.height;
    const offsetX = x / src_attachment.width;
    const offsetY = y / src_attachment.height;

    $uniform4[0] = scaleX;
    $uniform4[1] = scaleY;
    $uniform4[2] = offsetX;
    $uniform4[3] = offsetY;
    const uniformBuffer = config.bufferManager.acquireAndWriteUniformBuffer($uniform4);

    const sampler = config.textureManager.createSampler("container_copy_sampler", false);
    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = src_attachment.texture.view;
    const bindGroup = config.device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
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
 * @description フィルター結果をメインアタッチメントに描画する
 *              Draws filter result to the main attachment
 * @param {ILocalFilterConfig} config フィルター設定 / Filter configuration
 * @param {IAttachmentObject} filter_attachment フィルターアタッチメント / Filter attachment
 * @param {IAttachmentObject} main_attachment メインアタッチメント / Main attachment
 * @param {IBlendMode} blend_mode ブレンドモード / Blend mode
 * @param {number} x X座標 / X coordinate
 * @param {number} y Y座標 / Y coordinate
 * @param {BufferManager} buffer_manager バッファマネージャ / Buffer manager
 * @return {void}
 */
const $drawFilterResultToMain = (
    config: ILocalFilterConfig,
    filter_attachment: IAttachmentObject,
    main_attachment: IAttachmentObject,
    blend_mode: IBlendMode,
    x: number,
    y: number,
    buffer_manager: BufferManager
): void => {

    if (!main_attachment.texture || !filter_attachment.texture) {
        return;
    }

    // WebGLと同じサブピクセル精度を維持するため、Math.floorを使用しない
    let drawX = x;
    let drawY = y;
    let drawWidth = filter_attachment.width;
    let drawHeight = filter_attachment.height;

    let uvOffsetX = 0;
    let uvOffsetY = 0;
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

    if (drawWidth <= 0 || drawHeight <= 0) {
        return;
    }

    const mainWidth = main_attachment.width;
    const mainHeight = main_attachment.height;
    if (drawX + drawWidth > mainWidth) {
        drawWidth = mainWidth - drawX;
    }
    if (drawY + drawHeight > mainHeight) {
        drawHeight = mainHeight - drawY;
    }

    if ($SIMPLE_BLEND_MODES.has(blend_mode)) {

        const useMsaa = main_attachment.msaa && main_attachment.msaaTexture?.view;

        let pipelineName: string;
        switch (blend_mode) {
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

        const uvScaleX = drawWidth / filter_attachment.width;
        const uvScaleY = drawHeight / filter_attachment.height;
        $uniform4[0] = uvScaleX;
        $uniform4[1] = uvScaleY;
        $uniform4[2] = uvOffsetX;
        $uniform4[3] = uvOffsetY;
        const uniformBuffer = buffer_manager.acquireAndWriteUniformBuffer($uniform4);

        ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
        $entries3[1].resource = sampler;
        $entries3[2].resource = filter_attachment.texture.view;
        const bindGroup = config.device.createBindGroup({
            "layout": bindGroupLayout,
            "entries": $entries3
        });

        const colorView = useMsaa ? main_attachment.msaaTexture!.view : main_attachment.texture.view;
        const resolveTarget = useMsaa ? main_attachment.texture.view : null;
        const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
            colorView, 0, 0, 0, 0, "load", resolveTarget
        );

        // Viewportはfloat値でサブピクセル精度を維持（WebGLのsetTransform相当）
        const vpX = Math.max(0, drawX);
        const vpY = Math.max(0, drawY);
        const vpW = Math.max(1, drawWidth);
        const vpH = Math.max(1, drawHeight);
        const scissorX = Math.max(0, Math.floor(vpX));
        const scissorY = Math.max(0, Math.floor(vpY));
        const scissorW = Math.max(1, Math.min(Math.ceil(vpX + vpW) - scissorX, mainWidth - scissorX));
        const scissorH = Math.max(1, Math.min(Math.ceil(vpY + vpH) - scissorY, mainHeight - scissorY));

        if (scissorW <= 0 || scissorH <= 0 || scissorX >= mainWidth || scissorY >= mainHeight) {
            return;
        }

        const passEncoder = config.commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.setViewport(vpX, vpY, vpW, vpH, 0, 1);
        passEncoder.setScissorRect(scissorX, scissorY, scissorW, scissorH);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();

    } else {

        // 複雑なブレンドモード
        const dstAttachment = $copyRegionToFilterAttachment(
            config, main_attachment, drawX, drawY, drawWidth, drawHeight
        );

        $uniform8[0] = $identityColorTransform[0];
        $uniform8[1] = $identityColorTransform[1];
        $uniform8[2] = $identityColorTransform[2];
        $uniform8[3] = $identityColorTransform[3];
        $uniform8[4] = $identityColorTransform[4] / 255;
        $uniform8[5] = $identityColorTransform[5] / 255;
        $uniform8[6] = $identityColorTransform[6] / 255;
        $uniform8[7] = 0;

        const blendedAttachment = blendApplyComplexBlendUseCase(
            filter_attachment, dstAttachment, blend_mode, $uniform8, {
                "device": config.device,
                "commandEncoder": config.commandEncoder,
                "bufferManager": config.bufferManager,
                "frameBufferManager": config.frameBufferManager,
                "pipelineManager": config.pipelineManager,
                "textureManager": config.textureManager,
                "frameTextures": config.frameTextures
            }
        );

        // 結果をメインに描画
        const useMsaa = main_attachment.msaa && main_attachment.msaaTexture?.view;
        const resultPipelineName = useMsaa ? "filter_complex_blend_output_msaa" : "filter_complex_blend_output";
        const resultPipeline = config.pipelineManager.getPipeline(resultPipelineName);
        const resultLayout = config.pipelineManager.getBindGroupLayout("positioned_texture");

        if (resultPipeline && resultLayout && blendedAttachment.texture && main_attachment.texture) {

            $uniform8[0] = drawX;
            $uniform8[1] = drawY;
            $uniform8[2] = blendedAttachment.width;
            $uniform8[3] = blendedAttachment.height;
            $uniform8[4] = main_attachment.width;
            $uniform8[5] = main_attachment.height;
            $uniform8[6] = 0;
            $uniform8[7] = 0;
            const uniformBuffer = buffer_manager.acquireAndWriteUniformBuffer($uniform8);

            const sampler = config.textureManager.createSampler("container_blend_output_sampler", false);

            ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
            $entries3[1].resource = sampler;
            $entries3[2].resource = blendedAttachment.texture.view;
            const bindGroup = config.device.createBindGroup({
                "layout": resultLayout,
                "entries": $entries3
            });

            const colorView = useMsaa ? main_attachment.msaaTexture!.view : main_attachment.texture.view;
            const resolveTarget = useMsaa ? main_attachment.texture.view : null;
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
 * @description フィルターチェーンをアタッチメントに適用する
 *              Applies a chain of filters to an attachment
 * @param {IAttachmentObject} filter_attachment フィルターアタッチメント / Filter attachment
 * @param {Float32Array} matrix 変換行列 / Transformation matrix
 * @param {Float32Array} params フィルターパラメータ配列 / Filter parameters array
 * @param {number} device_pixel_ratio デバイスピクセル比 / Device pixel ratio
 * @param {ILocalFilterConfig} config フィルター設定 / Filter configuration
 * @return {IAttachmentObject} フィルター適用後のアタッチメント / Attachment with filters applied
 */
const $applyFilterChain = (
    filter_attachment: IAttachmentObject,
    matrix: Float32Array,
    params: Float32Array,
    device_pixel_ratio: number,
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
                        filter_attachment, matrix,
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], Boolean(params[idx++]),
                        device_pixel_ratio, config
                    );
                    if (filter_attachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filter_attachment);
                    }
                    filter_attachment = newAtt;
                }
                break;

            case 1: // BlurFilter
                {
                    const newAtt = filterApplyBlurFilterUseCase(
                        filter_attachment, matrix,
                        params[idx++], params[idx++], params[idx++],
                        device_pixel_ratio, config
                    );
                    if (filter_attachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filter_attachment);
                    }
                    filter_attachment = newAtt;
                }
                break;

            case 2: // ColorMatrixFilter
                {
                    $uniform20[0] = params[idx++];
                    $uniform20[1] = params[idx++];
                    $uniform20[2] = params[idx++];
                    $uniform20[3] = params[idx++];
                    $uniform20[4] = params[idx++];
                    $uniform20[5] = params[idx++];
                    $uniform20[6] = params[idx++];
                    $uniform20[7] = params[idx++];
                    $uniform20[8] = params[idx++];
                    $uniform20[9] = params[idx++];
                    $uniform20[10] = params[idx++];
                    $uniform20[11] = params[idx++];
                    $uniform20[12] = params[idx++];
                    $uniform20[13] = params[idx++];
                    $uniform20[14] = params[idx++];
                    $uniform20[15] = params[idx++];
                    $uniform20[16] = params[idx++];
                    $uniform20[17] = params[idx++];
                    $uniform20[18] = params[idx++];
                    $uniform20[19] = params[idx++];
                    const newAtt = filterApplyColorMatrixFilterUseCase(
                        filter_attachment, $uniform20, config
                    );
                    if (filter_attachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filter_attachment);
                    }
                    filter_attachment = newAtt;
                }
                break;

            case 3: // ConvolutionFilter
                {
                    const matrixX = params[idx++];
                    const matrixY = params[idx++];
                    const length = matrixX * matrixY;
                    const convMatrix = new Float32Array(length);
                    for (let i = 0; i < length; i++) {
                        convMatrix[i] = params[idx++];
                    }

                    const newAtt = filterApplyConvolutionFilterUseCase(
                        filter_attachment,
                        matrixX, matrixY, convMatrix,
                        params[idx++], params[idx++],
                        Boolean(params[idx++]), Boolean(params[idx++]),
                        params[idx++], params[idx++],
                        config
                    );
                    if (filter_attachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filter_attachment);
                    }
                    filter_attachment = newAtt;
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
                        filter_attachment, matrix,
                        dmBuffer, params[idx++], params[idx++],
                        params[idx++], params[idx++],
                        params[idx++], params[idx++],
                        params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++],
                        device_pixel_ratio, config
                    );
                    if (filter_attachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filter_attachment);
                    }
                    filter_attachment = newAtt;
                }
                break;

            case 5: // DropShadowFilter
                {
                    const newAtt = filterApplyDropShadowFilterUseCase(
                        filter_attachment, matrix,
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        Boolean(params[idx++]), Boolean(params[idx++]), Boolean(params[idx++]),
                        device_pixel_ratio, config
                    );
                    if (filter_attachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filter_attachment);
                    }
                    filter_attachment = newAtt;
                }
                break;

            case 6: // GlowFilter
                {
                    const newAtt = filterApplyGlowFilterUseCase(
                        filter_attachment, matrix,
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], Boolean(params[idx++]), Boolean(params[idx++]),
                        device_pixel_ratio, config
                    );
                    if (filter_attachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filter_attachment);
                    }
                    filter_attachment = newAtt;
                }
                break;

            case 7: // GradientBevelFilter
                {
                    const gbDist = params[idx++];
                    const gbAngle = params[idx++];

                    const gbColorsLen = params[idx++];
                    const gbColors = new Float32Array(gbColorsLen);
                    for (let i = 0; i < gbColorsLen; i++) { gbColors[i] = params[idx++] }

                    const gbAlphasLen = params[idx++];
                    const gbAlphas = new Float32Array(gbAlphasLen);
                    for (let i = 0; i < gbAlphasLen; i++) { gbAlphas[i] = params[idx++] }

                    const gbRatiosLen = params[idx++];
                    const gbRatios = new Float32Array(gbRatiosLen);
                    for (let i = 0; i < gbRatiosLen; i++) { gbRatios[i] = params[idx++] }

                    const newAtt = filterApplyGradientBevelFilterUseCase(
                        filter_attachment, matrix,
                        gbDist, gbAngle, gbColors, gbAlphas, gbRatios,
                        params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], Boolean(params[idx++]),
                        device_pixel_ratio, config
                    );
                    if (filter_attachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filter_attachment);
                    }
                    filter_attachment = newAtt;
                }
                break;

            case 8: // GradientGlowFilter
                {
                    const ggDist = params[idx++];
                    const ggAngle = params[idx++];

                    const ggColorsLen = params[idx++];
                    const ggColors = new Float32Array(ggColorsLen);
                    for (let i = 0; i < ggColorsLen; i++) { ggColors[i] = params[idx++] }

                    const ggAlphasLen = params[idx++];
                    const ggAlphas = new Float32Array(ggAlphasLen);
                    for (let i = 0; i < ggAlphasLen; i++) { ggAlphas[i] = params[idx++] }

                    const ggRatiosLen = params[idx++];
                    const ggRatios = new Float32Array(ggRatiosLen);
                    for (let i = 0; i < ggRatiosLen; i++) { ggRatios[i] = params[idx++] }

                    const newAtt = filterApplyGradientGlowFilterUseCase(
                        filter_attachment, matrix,
                        ggDist, ggAngle, ggColors, ggAlphas, ggRatios,
                        params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], Boolean(params[idx++]),
                        device_pixel_ratio, config
                    );
                    if (filter_attachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filter_attachment);
                    }
                    filter_attachment = newAtt;
                }
                break;
        }
    }

    return filter_attachment;
};

/**
 * @description コンテナレイヤーの終了処理を実行する（フィルター適用＋ブレンド＋メインへの描画）
 *              Executes container layer end processing (filter application + blending + drawing to main)
 * @param {IAttachmentObject} temp_attachment 一時アタッチメント / Temporary attachment
 * @param {IAttachmentObject} main_attachment メインアタッチメント / Main attachment
 * @param {string} _temp_name 一時名（未使用） / Temporary name (unused)
 * @param {IBlendMode} blend_mode ブレンドモード / Blend mode
 * @param {Float32Array} matrix 変換行列 / Transformation matrix
 * @param {Float32Array | null} color_transform カラートランスフォーム配列 / Color transform array
 * @param {boolean} use_filter フィルター使用フラグ / Whether to use filter
 * @param {Float32Array | null} filter_bounds フィルターバウンディングボックス / Filter bounding box
 * @param {Float32Array | null} params フィルターパラメータ配列 / Filter parameters array
 * @param {string} unique_key ユニークキー / Unique key
 * @param {string} filter_key フィルターキー / Filter key
 * @param {number} _content_width コンテンツ幅（未使用） / Content width (unused)
 * @param {number} _content_height コンテンツ高さ（未使用） / Content height (unused)
 * @param {ILocalFilterConfig} config フィルター設定 / Filter configuration
 * @param {BufferManager} buffer_manager バッファマネージャ / Buffer manager
 * @return {void}
 */
export const execute = (
    temp_attachment: IAttachmentObject,
    main_attachment: IAttachmentObject,
    _temp_name: string,
    blend_mode: IBlendMode,
    matrix: Float32Array,
    color_transform: Float32Array | null,
    use_filter: boolean,
    filter_bounds: Float32Array | null,
    params: Float32Array | null,
    unique_key: string,
    filter_key: string,
    _content_width: number,
    _content_height: number,
    config: ILocalFilterConfig,
    buffer_manager: BufferManager,
    // TODO: WebGPU版でも layer_scale による 1/layerScale 縮小合成に対応する。
    // 現状はWebGL版のみで動作、WebGPU版は従来通り layer_scale=1 として合成される。
    _layer_scale_x: number = 1,
    _layer_scale_y: number = 1
): void => {

    if (use_filter && matrix && filter_bounds && params) {

        // containerEndLayerが呼ばれる＝ディスプレイレイヤーがコンテンツ変更を検出して再レンダリングを要求
        // 常に新鮮なテクスチャを抽出してフィルターを適用する
        // （キャッシュはディスプレイレイヤーのcontainerDrawCachedFilterで管理）

        // WebGL版と同じ: レイヤー全体をフィルター用にコピー
        // レイヤーはコンテンツサイズで作成され、childrenは相対座標で描画されているため
        // (0, 0, layerWidth, layerHeight) = コンテンツ全体
        let filterAttachment = $copyRegionToFilterAttachment(
            config, temp_attachment,
            0, 0, temp_attachment.width, temp_attachment.height
        );

        // 一時アタッチメントを遅延解放（コマンドバッファsubmit後に解放）
        // destroyAttachmentは即座にGPUテクスチャを破棄するため、
        // コマンドエンコーダに記録済みのレンダーパスが参照するテクスチャが無効になる
        config.frameBufferManager.releaseTemporaryAttachment(temp_attachment);

        // フィルターチェーンを適用
        const devicePixelRatio = WebGPUUtil.getDevicePixelRatio();
        filterAttachment = $applyFilterChain(
            filterAttachment, matrix, params, devicePixelRatio, config
        );

        // キャッシュに保存（古いfTextureを先に解放してGPUリーク防止）
        if (unique_key) {
            const oldAttachment = $cacheStore.get(unique_key, "fTexture") as IAttachmentObject | null;
            if (oldAttachment) {
                config.frameBufferManager.releaseTemporaryAttachment(oldAttachment);
            }
            $cacheStore.set(unique_key, "fKey", filter_key);
            $cacheStore.set(unique_key, "fTexture", filterAttachment);
        }

        // フィルター結果をメインに描画
        if (filterAttachment) {
            // ColorTransformが恒等変換でない場合、描画用に一時コピーを作成してCTを適用
            // キャッシュにはフィルター結果のみ保存（CTは毎フレーム適用する）
            let drawAttachment = filterAttachment;
            let ctAttachment: IAttachmentObject | null = null;
            if (!$isIdentityColorTransform(color_transform)) {
                ctAttachment = $applyColorTransform(config, filterAttachment, color_transform!);
                drawAttachment = ctAttachment;
            }

            const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
            const scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
            const boundsXMin = filter_bounds[0] * (scaleX / devicePixelRatio);
            const boundsYMin = filter_bounds[1] * (scaleY / devicePixelRatio);

            // WebGL版と同じ: boundsXMin + matrix[4] で絶対位置
            const drawX = boundsXMin + matrix[4];
            const drawY = boundsYMin + matrix[5];

            $drawFilterResultToMain(
                config, drawAttachment, main_attachment,
                blend_mode, drawX, drawY, buffer_manager
            );

            // CT一時アタッチメントを解放
            if (ctAttachment) {
                config.frameBufferManager.releaseTemporaryAttachment(ctAttachment);
            }
            // キャッシュされていないフィルター結果のみ解放
            if (!unique_key) {
                config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
            }
        }

    } else {

        // ブレンドのみ：レイヤー全体をフィルター用にコピーしてメインに描画
        let fullAttachment = $copyRegionToFilterAttachment(
            config, temp_attachment,
            0, 0, temp_attachment.width, temp_attachment.height
        );

        // 一時アタッチメントを遅延解放（コマンドバッファsubmit後に解放）
        config.frameBufferManager.releaseTemporaryAttachment(temp_attachment);

        // ColorTransformが恒等変換でない場合、適用
        if (!$isIdentityColorTransform(color_transform)) {
            const ctAttachment = $applyColorTransform(config, fullAttachment, color_transform!);
            config.frameBufferManager.releaseTemporaryAttachment(fullAttachment);
            fullAttachment = ctAttachment;
        }

        // WebGL版と同じ: matrix[4], matrix[5] = layerBounds の絶対位置に描画
        $drawFilterResultToMain(
            config, fullAttachment, main_attachment,
            blend_mode, matrix[4], matrix[5], buffer_manager
        );

        config.frameBufferManager.releaseTemporaryAttachment(fullAttachment);
    }
};
