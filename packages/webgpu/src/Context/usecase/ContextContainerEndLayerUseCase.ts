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

const $uniform4 = new Float32Array(4);
const $uniform8 = new Float32Array(8);
const $uniform20 = new Float32Array(20);

// プリアロケート BindGroup Entry 配列
const $entries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": { "buffer": null as unknown as GPUBuffer } },
    { "binding": 1, "resource": null as unknown as GPUSampler },
    { "binding": 2, "resource": null as unknown as GPUTextureView }
];

const SIMPLE_BLEND_MODES: ReadonlySet<IBlendMode> = new Set([
    "normal", "layer", "add", "screen", "alpha", "erase", "copy"
] as IBlendMode[]);

const $identityColorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

const isIdentityColorTransform = (ct: Float32Array | null): boolean => {
    if (!ct) {
        return true;
    }
    return ct[0] === 1 && ct[1] === 1 && ct[2] === 1 && ct[3] === 1
        && ct[4] === 0 && ct[5] === 0 && ct[6] === 0 && ct[7] === 0;
};

const applyColorTransform = (
    config: ILocalFilterConfig,
    attachment: IAttachmentObject,
    colorTransform: Float32Array
): IAttachmentObject => {
    const ctAttachment = config.frameBufferManager.createTemporaryAttachment(
        attachment.width, attachment.height
    );

    const pipeline = config.pipelineManager.getPipeline("color_transform");
    const bindGroupLayout = config.pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout || !attachment.texture || !ctAttachment.texture) {
        return attachment;
    }

    $uniform8[0] = colorTransform[0];
    $uniform8[1] = colorTransform[1];
    $uniform8[2] = colorTransform[2];
    $uniform8[3] = colorTransform[3];
    $uniform8[4] = colorTransform[4];
    $uniform8[5] = colorTransform[5];
    $uniform8[6] = colorTransform[6];
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
    const offsetX = x / srcAttachment.width;

    // ComplexBlendCopyVertexはOpenGL座標系のtexCoord（Y軸反転）を使用するため、
    // UV uniformでY反転を補正して正しい向きの出力を得る
    // texCoord.y=1(fb上端) → uv.y=y/H(ソース上端), texCoord.y=0(fb下端) → uv.y=(y+h)/H(ソース下端)
    const scaleY = -(height / srcAttachment.height);
    const offsetY = (y + height) / srcAttachment.height;

    $uniform4[0] = scaleX;
    $uniform4[1] = scaleY;
    $uniform4[2] = offsetX;
    $uniform4[3] = offsetY;
    const uniformBuffer = config.bufferManager.acquireAndWriteUniformBuffer($uniform4);

    const sampler = config.textureManager.createSampler("container_copy_sampler", false);
    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = srcAttachment.texture.view;
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

    // WebGLと同じサブピクセル精度を維持するため、Math.floorを使用しない
    let drawX = x;
    let drawY = y;
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

        const uvScaleX = drawWidth / filterAttachment.width;
        const uvScaleY = drawHeight / filterAttachment.height;
        $uniform4[0] = uvScaleX;
        $uniform4[1] = uvScaleY;
        $uniform4[2] = uvOffsetX;
        $uniform4[3] = uvOffsetY;
        const uniformBuffer = bufferManager.acquireAndWriteUniformBuffer($uniform4);

        ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
        $entries3[1].resource = sampler;
        $entries3[2].resource = filterAttachment.texture.view;
        const bindGroup = config.device.createBindGroup({
            "layout": bindGroupLayout,
            "entries": $entries3
        });

        const colorView = useMsaa ? mainAttachment.msaaTexture!.view : mainAttachment.texture.view;
        const resolveTarget = useMsaa ? mainAttachment.texture.view : null;
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
        const dstAttachment = copyRegionToFilterAttachment(
            config, mainAttachment, drawX, drawY, drawWidth, drawHeight
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
            filterAttachment, dstAttachment, blendMode, $uniform8, {
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
        const useMsaa = mainAttachment.msaa && mainAttachment.msaaTexture?.view;
        const resultPipelineName = useMsaa ? "filter_complex_blend_output_msaa" : "filter_complex_blend_output";
        const resultPipeline = config.pipelineManager.getPipeline(resultPipelineName);
        const resultLayout = config.pipelineManager.getBindGroupLayout("positioned_texture");

        if (resultPipeline && resultLayout && blendedAttachment.texture && mainAttachment.texture) {

            $uniform8[0] = drawX;
            $uniform8[1] = drawY;
            $uniform8[2] = blendedAttachment.width;
            $uniform8[3] = blendedAttachment.height;
            $uniform8[4] = mainAttachment.width;
            $uniform8[5] = mainAttachment.height;
            $uniform8[6] = 0;
            $uniform8[7] = 0;
            const uniformBuffer = bufferManager.acquireAndWriteUniformBuffer($uniform8);

            const sampler = config.textureManager.createSampler("container_blend_output_sampler", false);

            ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
            $entries3[1].resource = sampler;
            $entries3[2].resource = blendedAttachment.texture.view;
            const bindGroup = config.device.createBindGroup({
                "layout": resultLayout,
                "entries": $entries3
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
                        filterAttachment, $uniform20, config
                    );
                    if (filterAttachment !== newAtt) {
                        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
                    }
                    filterAttachment = newAtt;
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
                        filterAttachment,
                        matrixX, matrixY, convMatrix,
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
                    for (let i = 0; i < gbColorsLen; i++) { gbColors[i] = params[idx++] }

                    const gbAlphasLen = params[idx++];
                    const gbAlphas = new Float32Array(gbAlphasLen);
                    for (let i = 0; i < gbAlphasLen; i++) { gbAlphas[i] = params[idx++] }

                    const gbRatiosLen = params[idx++];
                    const gbRatios = new Float32Array(gbRatiosLen);
                    for (let i = 0; i < gbRatiosLen; i++) { gbRatios[i] = params[idx++] }

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
                    for (let i = 0; i < ggColorsLen; i++) { ggColors[i] = params[idx++] }

                    const ggAlphasLen = params[idx++];
                    const ggAlphas = new Float32Array(ggAlphasLen);
                    for (let i = 0; i < ggAlphasLen; i++) { ggAlphas[i] = params[idx++] }

                    const ggRatiosLen = params[idx++];
                    const ggRatios = new Float32Array(ggRatiosLen);
                    for (let i = 0; i < ggRatiosLen; i++) { ggRatios[i] = params[idx++] }

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

export const execute = (
    tempAttachment: IAttachmentObject,
    mainAttachment: IAttachmentObject,
    _tempName: string,
    blendMode: IBlendMode,
    matrix: Float32Array,
    colorTransform: Float32Array | null,
    useFilter: boolean,
    filterBounds: Float32Array | null,
    params: Float32Array | null,
    uniqueKey: string,
    filterKey: string,
    _contentWidth: number,
    _contentHeight: number,
    config: ILocalFilterConfig,
    bufferManager: BufferManager
): void => {

    if (useFilter && matrix && filterBounds && params) {

        // containerEndLayerが呼ばれる＝ディスプレイレイヤーがコンテンツ変更を検出して再レンダリングを要求
        // 常に新鮮なテクスチャを抽出してフィルターを適用する
        // （キャッシュはディスプレイレイヤーのcontainerDrawCachedFilterで管理）

        // WebGL版と同じ: レイヤー全体をフィルター用にコピー
        // レイヤーはコンテンツサイズで作成され、childrenは相対座標で描画されているため
        // (0, 0, layerWidth, layerHeight) = コンテンツ全体
        let filterAttachment = copyRegionToFilterAttachment(
            config, tempAttachment,
            0, 0, tempAttachment.width, tempAttachment.height
        );

        // 一時アタッチメントを遅延解放（コマンドバッファsubmit後に解放）
        // destroyAttachmentは即座にGPUテクスチャを破棄するため、
        // コマンドエンコーダに記録済みのレンダーパスが参照するテクスチャが無効になる
        config.frameBufferManager.releaseTemporaryAttachment(tempAttachment);

        // フィルターチェーンを適用
        const devicePixelRatio = WebGPUUtil.getDevicePixelRatio();
        filterAttachment = applyFilterChain(
            filterAttachment, matrix, params, devicePixelRatio, config
        );

        // キャッシュに保存
        if (uniqueKey) {
            $cacheStore.set(uniqueKey, "fKey", filterKey);
            $cacheStore.set(uniqueKey, "fTexture", filterAttachment);
        }

        // フィルター結果をメインに描画
        if (filterAttachment) {
            // ColorTransformが恒等変換でない場合、描画用に一時コピーを作成してCTを適用
            // キャッシュにはフィルター結果のみ保存（CTは毎フレーム適用する）
            let drawAttachment = filterAttachment;
            let ctAttachment: IAttachmentObject | null = null;
            if (!isIdentityColorTransform(colorTransform)) {
                ctAttachment = applyColorTransform(config, filterAttachment, colorTransform!);
                drawAttachment = ctAttachment;
            }

            const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
            const scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
            const boundsXMin = filterBounds[0] * (scaleX / devicePixelRatio);
            const boundsYMin = filterBounds[1] * (scaleY / devicePixelRatio);

            // WebGL版と同じ: boundsXMin + matrix[4] で絶対位置
            const drawX = boundsXMin + matrix[4];
            const drawY = boundsYMin + matrix[5];

            drawFilterResultToMain(
                config, drawAttachment, mainAttachment,
                blendMode, drawX, drawY, bufferManager
            );

            // CT一時アタッチメントを解放
            if (ctAttachment) {
                config.frameBufferManager.releaseTemporaryAttachment(ctAttachment);
            }
            // キャッシュされていないフィルター結果のみ解放
            if (!uniqueKey) {
                config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
            }
        }

    } else {

        // ブレンドのみ：レイヤー全体をフィルター用にコピーしてメインに描画
        let fullAttachment = copyRegionToFilterAttachment(
            config, tempAttachment,
            0, 0, tempAttachment.width, tempAttachment.height
        );

        // 一時アタッチメントを遅延解放（コマンドバッファsubmit後に解放）
        config.frameBufferManager.releaseTemporaryAttachment(tempAttachment);

        // ColorTransformが恒等変換でない場合、適用
        if (!isIdentityColorTransform(colorTransform)) {
            const ctAttachment = applyColorTransform(config, fullAttachment, colorTransform!);
            config.frameBufferManager.releaseTemporaryAttachment(fullAttachment);
            fullAttachment = ctAttachment;
        }

        // WebGL版と同じ: matrix[4], matrix[5] = layerBounds の絶対位置に描画
        drawFilterResultToMain(
            config, fullAttachment, mainAttachment,
            blendMode, matrix[4], matrix[5], bufferManager
        );

        config.frameBufferManager.releaseTemporaryAttachment(fullAttachment);
    }
};
