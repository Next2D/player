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
import { execute as blendApplyComplexBlendUseCase } from "../../Blend/usecase/BlendApplyComplexBlendUseCase";

const $uniform4 = new Float32Array(4);
const $uniform6a = new Float32Array(6);
const $uniform6b = new Float32Array(6);
const $uniform8 = new Float32Array(8);
const $uniform12 = new Float32Array(12);
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

const Y_FLIP_UNIFORM = new Float32Array([1, -1, 0, 1]);

const isIdentityColorTransform = (ct: Float32Array): boolean => {
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

    // uniform: mul(vec4) + add(vec4) = 32 bytes
    // add値は0-255スケールの生値をそのまま渡す（WebGLのフィルターCTパスと同じ）
    $uniform8[0] = colorTransform[0];
    $uniform8[1] = colorTransform[1];
    $uniform8[2] = colorTransform[2];
    $uniform8[3] = colorTransform[3];
    $uniform8[4] = colorTransform[4];
    $uniform8[5] = colorTransform[5];
    $uniform8[6] = colorTransform[6];
    $uniform8[7] = 0;
    const uniformBuffer = config.bufferManager.acquireUniformBuffer(32);
    config.device.queue.writeBuffer(uniformBuffer, 0, $uniform8);

    const sampler = config.textureManager.createSampler("color_transform_sampler", false);

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

const isSimpleBlendMode = (blendMode: IBlendMode): boolean => {
    return SIMPLE_BLEND_MODES.has(blendMode);
};

const copyMainAttachmentRegion = (
    config: ILocalFilterConfig,
    mainAttachment: IAttachmentObject,
    x: number,
    y: number,
    width: number,
    height: number
): IAttachmentObject => {
    // 一時アタッチメントを作成
    const dstAttachment = config.frameBufferManager.createTemporaryAttachment(width, height);

    // レンダーパスでコピー（フォーマット変換: bgra8unorm -> rgba8unorm）
    const pipeline = config.pipelineManager.getPipeline("complex_blend_copy");
    const bindGroupLayout = config.pipelineManager.getBindGroupLayout("texture_copy");

    if (!pipeline || !bindGroupLayout || !mainAttachment.texture || !dstAttachment.texture) {
        return dstAttachment;
    }

    // ユニフォームバッファ: scale (vec2) + offset (vec2)
    const scaleX = width / mainAttachment.width;
    const scaleY = height / mainAttachment.height;
    const offsetX = x / mainAttachment.width;
    const offsetY = y / mainAttachment.height;

    $uniform4[0] = scaleX;
    $uniform4[1] = scaleY;
    $uniform4[2] = offsetX;
    $uniform4[3] = offsetY;
    const uniformBuffer = config.bufferManager.acquireUniformBuffer(16);
    config.device.queue.writeBuffer(uniformBuffer, 0, $uniform4);

    const sampler = config.textureManager.createSampler("filter_copy_sampler", false);

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = mainAttachment.texture.view;
    const bindGroup = config.device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
        dstAttachment.texture.view,
        0, 0, 0, 0,
        "clear"
    );

    const passEncoder = config.commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    return dstAttachment;
};

const drawBlendResultToMain = (
    config: ILocalFilterConfig,
    srcAttachment: IAttachmentObject,
    mainAttachment: IAttachmentObject,
    x: number,
    y: number
): void => {
    // フィルター＋複雑なブレンド用のパイプライン（Y軸反転あり）を使用
    // MSAA有効時はMSAA版パイプラインを使用してmsaaTextureに描画→texture.viewにresolve
    const useMsaa = mainAttachment.msaa && mainAttachment.msaaTexture?.view;
    const pipelineName = useMsaa ? "filter_complex_blend_output_msaa" : "filter_complex_blend_output";
    const pipeline = config.pipelineManager.getPipeline(pipelineName);
    const bindGroupLayout = config.pipelineManager.getBindGroupLayout("positioned_texture");

    if (!pipeline || !bindGroupLayout || !srcAttachment.texture || !mainAttachment.texture) {
        return;
    }

    // ユニフォームデータ: offset, size, viewport, padding
    $uniform8[0] = x;
    $uniform8[1] = y;
    $uniform8[2] = srcAttachment.width;
    $uniform8[3] = srcAttachment.height;
    $uniform8[4] = mainAttachment.width;
    $uniform8[5] = mainAttachment.height;
    $uniform8[6] = 0;
    $uniform8[7] = 0;
    const uniformBuffer = config.bufferManager.acquireUniformBuffer(32);
    config.device.queue.writeBuffer(uniformBuffer, 0, $uniform8);

    const sampler = config.textureManager.createSampler("filter_blend_output_sampler", false);

    ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
    $entries3[1].resource = sampler;
    $entries3[2].resource = srcAttachment.texture.view;
    const bindGroup = config.device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $entries3
    });

    // メインアタッチメントへの描画（loadで既存内容を保持）
    // MSAA有効時はmsaaTextureに描画してtexture.viewにresolve
    const colorView = useMsaa ? mainAttachment.msaaTexture!.view : mainAttachment.texture.view;
    const resolveTarget = useMsaa ? mainAttachment.texture.view : null;
    const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
        colorView,
        0, 0, 0, 0,
        "load",
        resolveTarget
    );

    const passEncoder = config.commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();
};

const drawFilterToMain = (
    config: ILocalFilterConfig,
    filter_attachment: IAttachmentObject,
    color_transform: Float32Array,
    blend_mode: IBlendMode,
    x: number,
    y: number,
    _main_texture_view: GPUTextureView,
    _buffer_manager: BufferManager
): void => {
    // メインアタッチメントに描画
    // コンテナレイヤー内ではconfig.mainAttachmentがコンテナのテンポラリアタッチメントを指す
    const mainAttachment = config.mainAttachment || config.frameBufferManager.getAttachment("main");
    if (!mainAttachment || !mainAttachment.texture || !filter_attachment.texture) {
        return;
    }

    // 描画位置とサイズを計算
    // WebGLと同じサブピクセル精度を維持するため、Math.floorを使用しない
    // Math.floorを使うと -0.012 → -1 になり、1ピクセル余分にクリップされてしまう
    let drawX = x;
    let drawY = y;
    let drawWidth = filter_attachment.width;
    let drawHeight = filter_attachment.height;

    // 負の描画位置を処理（画面外の部分をクリップ）
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

    // シンプルなブレンドモードの場合
    if (isSimpleBlendMode(blend_mode)) {
        // MSAA有効時はMSAA版パイプラインを使用してmsaaTextureに描画→texture.viewにresolve
        const useMsaa = mainAttachment.msaa && mainAttachment.msaaTexture?.view;

        // ブレンドモードに応じたパイプラインを選択
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
                // normal, layer
                pipelineName = useMsaa ? "filter_output_msaa" : "filter_output";
                break;
        }

        let pipeline = config.pipelineManager.getPipeline(pipelineName);
        let bindGroupLayout = config.pipelineManager.getBindGroupLayout("texture_copy");

        if (!pipeline || !bindGroupLayout) {
            // フォールバック
            pipelineName = useMsaa ? "filter_output_msaa" : "filter_output";
            pipeline = config.pipelineManager.getPipeline(pipelineName);
            bindGroupLayout = config.pipelineManager.getBindGroupLayout("texture_copy");
            if (!pipeline || !bindGroupLayout) {
                return;
            }
        }

        const sampler = config.textureManager.createSampler("filter_output_sampler", true);

        // UV座標の設定
        // viewportをdrawWidth/drawHeightに合わせるため、uvScaleでテクスチャの表示範囲を制御
        // uv = texCoord * scale + offset で texCoord[0,1] → uv[uvOffset, uvOffset+uvScale]
        const uvScaleX = drawWidth / filter_attachment.width;
        const uvScaleY = drawHeight / filter_attachment.height;
        $uniform4[0] = uvScaleX;
        $uniform4[1] = uvScaleY;
        $uniform4[2] = uvOffsetX;
        $uniform4[3] = uvOffsetY;
        const uniformBuffer = config.bufferManager.acquireUniformBuffer(16);
        config.device.queue.writeBuffer(uniformBuffer, 0, $uniform4);

        ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
        $entries3[1].resource = sampler;
        $entries3[2].resource = filter_attachment.texture.view;
        const bindGroup = config.device.createBindGroup({
            "layout": bindGroupLayout,
            "entries": $entries3
        });

        // MSAA有効時はmsaaTextureに描画してtexture.viewにresolve
        const colorView = useMsaa ? mainAttachment.msaaTexture!.view : mainAttachment.texture.view;
        const resolveTarget = useMsaa ? mainAttachment.texture.view : null;
        const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
            colorView,
            0, 0, 0, 0,
            "load",
            resolveTarget
        );

        // Viewportはfloat値でサブピクセル精度を維持（WebGLのsetTransform相当）
        // ScissorはGPUIntegerCoordinate必須のため整数化し、viewport領域を包含する
        const vpX = Math.max(0, drawX);
        const vpY = Math.max(0, drawY);
        const vpW = Math.max(1, drawWidth);
        const vpH = Math.max(1, drawHeight);
        const scissorX = Math.max(0, Math.floor(vpX));
        const scissorY = Math.max(0, Math.floor(vpY));
        const scissorW = Math.max(1, Math.min(Math.ceil(vpX + vpW) - scissorX, mainWidth - scissorX));
        const scissorH = Math.max(1, Math.min(Math.ceil(vpY + vpH) - scissorY, mainHeight - scissorY));

        // 描画が有効な範囲内でのみ実行
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
        // 複雑なブレンドモード（multiply, overlay, darken, lighten, hardlight等）
        // 1. メインアタッチメントから描画先の矩形をコピー
        const dstAttachment = copyMainAttachmentRegion(
            config, mainAttachment,
            drawX, drawY, drawWidth, drawHeight
        );

        // 2. カラートランスフォームを準備（WebGL版と同じ：add値は生値）
        $uniform8[0] = color_transform[0];  // mulR
        $uniform8[1] = color_transform[1];  // mulG
        $uniform8[2] = color_transform[2];  // mulB
        $uniform8[3] = color_transform[3];  // mulA (globalAlpha)
        $uniform8[4] = color_transform[4];  // addR
        $uniform8[5] = color_transform[5];  // addG
        $uniform8[6] = color_transform[6];  // addB
        $uniform8[7] = 0;                   // addA

        // 3. 複雑なブレンドを適用
        const blendedAttachment = blendApplyComplexBlendUseCase(
            filter_attachment,
            dstAttachment,
            blend_mode,
            $uniform8,
            {
                "device": config.device,
                "commandEncoder": config.commandEncoder,
                "bufferManager": config.bufferManager,
                "frameBufferManager": config.frameBufferManager,
                "pipelineManager": config.pipelineManager,
                "textureManager": config.textureManager
            }
        );

        // 4. 結果をメインアタッチメントに描画
        drawBlendResultToMain(
            config,
            blendedAttachment,
            mainAttachment,
            drawX,
            drawY
        );

        // 5. 一時テクスチャを解放
        config.frameBufferManager.releaseTemporaryAttachment(dstAttachment);
        config.frameBufferManager.releaseTemporaryAttachment(blendedAttachment);
    }
};

export const execute = (
    node: Node,
    width: number,
    height: number,
    is_bitmap: boolean,
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

    // アトラスのY反転を補正
    // WebGPUではアトラスに描画する際にY軸が反転して格納される:
    // - Shape: FillVertexがndc.yを反転なしで使用するため、WebGPUのNDC→ピクセル変換でY反転
    // - Bitmap/TextField: PositionedTextureVertexのtexCoord Y反転 + position.y反転
    // どちらも同じ方向にY反転しているため、フィルタ処理前に全コンテンツを補正する
    if (filterAttachment.texture) {
        const flippedAttachment = config.frameBufferManager.createTemporaryAttachment(node.w, node.h);
        const flipPipeline = config.pipelineManager.getPipeline("texture_copy_rgba8");
        const flipBindGroupLayout = config.pipelineManager.getBindGroupLayout("texture_copy");

        if (flipPipeline && flipBindGroupLayout && flippedAttachment.texture) {
            const sampler = config.textureManager.createSampler("filter_flip_sampler", false);

            // scale=(1, -1), offset=(0, 1) で UV.y = texCoord.y * (-1) + 1 = 1 - texCoord.y
            const uniformBuffer = config.bufferManager.acquireUniformBuffer(16);
            config.device.queue.writeBuffer(uniformBuffer, 0, Y_FLIP_UNIFORM);

            ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
            $entries3[1].resource = sampler;
            $entries3[2].resource = filterAttachment.texture.view;
            const bindGroup = config.device.createBindGroup({
                "layout": flipBindGroupLayout,
                "entries": $entries3
            });

            const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
                flippedAttachment.texture.view, 0, 0, 0, 0, "clear"
            );

            const passEncoder = config.commandEncoder.beginRenderPass(renderPassDescriptor);
            passEncoder.setPipeline(flipPipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.draw(6, 1, 0, 0);
            passEncoder.end();

            config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
            filterAttachment = flippedAttachment;
        }
    }

    const devicePixelRatio = WebGPUUtil.getDevicePixelRatio();

    // スケール・回転が適用されているかチェック（WebGL版と同じロジック）
    const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
    const radianX = Math.atan2(matrix[1], matrix[0]);
    const radianY = Math.atan2(-matrix[2], matrix[3]);

    // is_bitmap=true（Video/Bitmap）の場合はスケールを適用、false（Shape）の場合はスケールなし
    const a0 = is_bitmap ? scaleX * Math.cos(radianX) : Math.cos(radianX);
    const b1 = is_bitmap ? scaleX * Math.sin(radianX) : Math.sin(radianX);
    const c2 = is_bitmap ? -scaleY * Math.sin(radianY) : -Math.sin(radianY);
    const d3 = is_bitmap ? scaleY * Math.cos(radianY) : Math.cos(radianY);

    // 変換行列を計算（WebGL版と同じ）
    $uniform6a[0] = a0;
    $uniform6a[1] = b1;
    $uniform6a[2] = c2;
    $uniform6a[3] = d3;
    $uniform6a[4] = width / 2;
    $uniform6a[5] = height / 2;

    $uniform6b[0] = 1;
    $uniform6b[1] = 0;
    $uniform6b[2] = 0;
    $uniform6b[3] = 1;
    $uniform6b[4] = -node.w / 2;
    $uniform6b[5] = -node.h / 2;

    // 行列乗算: a * b
    const tMatrix0 = $uniform6a[0] * $uniform6b[0] + $uniform6a[2] * $uniform6b[1];
    const tMatrix1 = $uniform6a[1] * $uniform6b[0] + $uniform6a[3] * $uniform6b[1];
    const tMatrix2 = $uniform6a[0] * $uniform6b[2] + $uniform6a[2] * $uniform6b[3];
    const tMatrix3 = $uniform6a[1] * $uniform6b[2] + $uniform6a[3] * $uniform6b[3];
    const tMatrix4 = $uniform6a[0] * $uniform6b[4] + $uniform6a[2] * $uniform6b[5] + $uniform6a[4];
    const tMatrix5 = $uniform6a[1] * $uniform6b[4] + $uniform6a[3] * $uniform6b[5] + $uniform6a[5];

    let offsetX = 0;
    let offsetY = 0;

    // スケール・回転変換が必要な場合（WebGL版と同じ条件）
    if (tMatrix0 !== 1 || tMatrix1 !== 0 || tMatrix2 !== 0 || tMatrix3 !== 1) {
        // スケール変換用のアタッチメントを作成
        const scaledAttachment = config.frameBufferManager.createTemporaryAttachment(width, height);

        // スケール変換用パイプラインを使用
        // ビットマップ/TextFieldのY反転はフィルタ処理前に補正済みのため、常にtexture_scaleを使用
        const scalePipelineName = "texture_scale";
        const scalePipeline = config.pipelineManager.getPipeline(scalePipelineName);
        const scaleBindGroupLayout = config.pipelineManager.getBindGroupLayout("texture_scale");

        if (scalePipeline && scaleBindGroupLayout) {
            // ユニフォームデータ: matrix (6 floats) + srcSize (2 floats) + dstSize (2 floats) + padding (2 floats)
            $uniform12[0] = tMatrix0;
            $uniform12[1] = tMatrix1;
            $uniform12[2] = tMatrix2;
            $uniform12[3] = tMatrix3;
            $uniform12[4] = tMatrix4;
            $uniform12[5] = tMatrix5;
            $uniform12[6] = node.w;
            $uniform12[7] = node.h;
            $uniform12[8] = width;
            $uniform12[9] = height;
            $uniform12[10] = 0;
            $uniform12[11] = 0;
            const uniformBuffer = config.bufferManager.acquireUniformBuffer(48);
            config.device.queue.writeBuffer(uniformBuffer, 0, $uniform12);

            const sampler = config.textureManager.createSampler("filter_scale_sampler", true);
            ($entries3[0].resource as GPUBufferBinding).buffer = uniformBuffer;
            $entries3[1].resource = sampler;
            $entries3[2].resource = filterAttachment.texture!.view;
            const bindGroup = config.device.createBindGroup({
                "layout": scaleBindGroupLayout,
                "entries": $entries3
            });

            const renderPassDescriptor = config.frameBufferManager.createRenderPassDescriptor(
                scaledAttachment.texture!.view,
                0, 0, 0, 0,
                "clear"
            );

            const passEncoder = config.commandEncoder.beginRenderPass(renderPassDescriptor);
            passEncoder.setPipeline(scalePipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.draw(6, 1, 0, 0);
            passEncoder.end();

            offsetX = tMatrix4;
            offsetY = tMatrix5;

            // 元のアタッチメントを解放してスケール済みアタッチメントを使用
            config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
            filterAttachment = scaledAttachment;
        }
    }

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

                    const newAttachment = filterApplyColorMatrixFilterUseCase(
                        filterAttachment, $uniform20, config
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

    // ColorTransformが恒等変換でない場合、フィルター結果に適用
    // WebGL版と同じ: フィルターチェーン適用後、メイン描画前にColorTransformを適用
    if (!isIdentityColorTransform(color_transform)) {
        const ctAttachment = applyColorTransform(config, filterAttachment, color_transform);
        config.frameBufferManager.releaseTemporaryAttachment(filterAttachment);
        filterAttachment = ctAttachment;
    }

    // フィルター適用後のテクスチャをメインキャンバスに描画
    // scaleX, scaleYは上部で計算済み
    const xMin = bounds[0] * (scaleX / devicePixelRatio);
    const yMin = bounds[1] * (scaleY / devicePixelRatio);

    // WebGL版と同じ: スケール変換のオフセットを考慮（$offsetはフィルターチェーン内部用で最終位置には不要）
    const drawX = -offsetX + xMin + matrix[4];
    const drawY = -offsetY + yMin + matrix[5];

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
