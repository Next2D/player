import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IBlendMode } from "../../interface/IBlendMode";
import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { getInstancedShaderManager } from "../../Blend/BlendInstancedManager";
import { $currentBlendMode } from "../../Blend";
import { renderQueue } from "@next2d/render-queue";
import {
    $isMaskTestEnabled,
    $getMaskStencilReference
} from "../../Mask";
import { $getAtlasAttachmentObject } from "../../AtlasManager";

let $cachedBindGroup: GPUBindGroup | null = null;
let $cachedAtlasView: GPUTextureView | null = null;

/**
 * @description ブレンドモードに応じたインスタンスパイプライン名を返す
 */
const $getPipelineName = (mode: IBlendMode): string => {
    switch (mode) {
        case "add":
            return "instanced_add";
        case "screen":
            return "instanced_screen";
        case "alpha":
            return "instanced_alpha";
        case "erase":
            return "instanced_erase";
        case "copy":
            return "instanced_copy";
        default:
            return "instanced";
    }
};

export const execute = (
    device: GPUDevice,
    command_encoder: GPUCommandEncoder,
    render_pass_encoder: GPURenderPassEncoder | null,
    main_attachment: IAttachmentObject,
    buffer_manager: BufferManager,
    frame_buffer_manager: FrameBufferManager,
    texture_manager: TextureManager,
    pipeline_manager: PipelineManager
): GPURenderPassEncoder | null => {
    const shaderManager = getInstancedShaderManager();

    if (shaderManager.count === 0) {
        return render_pass_encoder;
    }

    // 既存のレンダーパスを終了
    if (render_pass_encoder) {
        render_pass_encoder.end();
        render_pass_encoder = null;
    }

    const isMasked = $isMaskTestEnabled();
    const maskReference = $getMaskStencilReference();

    // 現在のブレンドモードを取得
    const blendMode: IBlendMode = $currentBlendMode;

    const pipelineName = $getPipelineName(blendMode);
    const normalPipeline = pipeline_manager.getPipeline(pipelineName);
    const maskedPipeline = pipeline_manager.getPipeline("instanced_masked");

    // 実際にマスクを使用するか判定
    // maskedパイプラインが存在し、マスクが有効で、ステンシルがある場合のみ
    const useStencil = isMasked && maskedPipeline
        && (main_attachment.msaaStencil?.view || main_attachment.stencil?.view);

    const pipeline = useStencil ? maskedPipeline : normalPipeline;

    if (!pipeline) {
        console.error("[WebGPU] Instanced pipeline not found");
        return null;
    }

    // レンダーパスを作成（パイプラインに合わせてステンシルの有無を決定）
    let passEncoder: GPURenderPassEncoder;

    if (useStencil) {
        // ステンシル付きレンダーパス（マスク用）- MSAA対応
        const useMsaa = main_attachment.msaa && main_attachment.msaaTexture?.view;
        const colorView = useMsaa ? main_attachment.msaaTexture!.view : main_attachment.texture!.view;
        const stencilView = useMsaa && main_attachment.msaaStencil?.view
            ? main_attachment.msaaStencil.view : main_attachment.stencil!.view;
        const resolveTarget = useMsaa ? main_attachment.texture!.view : null;

        const renderPassDescriptor = frame_buffer_manager.createStencilRenderPassDescriptor(
            colorView,
            stencilView,
            "load", // カラーは既存の内容を保持
            "load",  // ステンシルも既存の内容を保持（マスク情報）
            resolveTarget
        );
        passEncoder = command_encoder.beginRenderPass(renderPassDescriptor);
    } else {
        // 通常のレンダーパス（MSAA対応）
        const useMsaa = main_attachment.msaa && main_attachment.msaaTexture?.view;
        const colorView = useMsaa ? main_attachment.msaaTexture!.view : main_attachment.texture!.view;
        const resolveTarget = useMsaa ? main_attachment.texture!.view : null;
        const renderPassDescriptor = frame_buffer_manager.createRenderPassDescriptor(
            colorView,
            0, 0, 0, 0,
            "load", // 既存の内容を保持
            resolveTarget
        );
        passEncoder = command_encoder.beginRenderPass(renderPassDescriptor);
    }

    passEncoder.setPipeline(pipeline);

    // マスク有効時はステンシル参照値を設定
    if (useStencil) {
        passEncoder.setStencilReference(maskReference);
    }

    // インスタンスバッファを作成
    // renderQueue.offsetは配列のインデックスなので、そのまま使用
    const instanceData = new Float32Array(
        renderQueue.buffer.buffer,
        renderQueue.buffer.byteOffset,
        renderQueue.offset  // 要素数
    );

    const instanceBuffer = buffer_manager.acquireVertexBuffer(instanceData.byteLength, instanceData);

    // 頂点バッファ（矩形）を取得（キャッシュ済み）
    const vertexBuffer = buffer_manager.getUnitRectBuffer();

    // アトラステクスチャをバインド（複数アトラス対応）
    // AtlasManagerから取得、フォールバックとしてFrameBufferManagerから取得
    const atlasAttachment = $getAtlasAttachmentObject() || frame_buffer_manager.getAttachment("atlas");
    if (!atlasAttachment) {
        console.error("[WebGPU] Atlas attachment not found");
        passEncoder.end();
        return null;
    }

    // アトラス用サンプラーを取得（キャッシュ済み）
    // MIN_FILTER: linear（縮小時・回転時にスムーズ）
    // MAG_FILTER: nearest（拡大時にシャープ）
    const sampler = texture_manager.createSampler("atlas_instanced_sampler", false);

    // バインドグループを作成
    const bindGroupLayout = pipeline_manager.getBindGroupLayout("instanced");
    if (!bindGroupLayout) {
        console.error("[WebGPU] Instanced bind group layout not found");
        passEncoder.end();
        return null;
    }

    // BindGroupキャッシュ: アトラスのテクスチャビューが同じなら再利用
    const atlasView = atlasAttachment.texture!.view;
    if (!$cachedBindGroup || $cachedAtlasView !== atlasView) {
        $cachedBindGroup = device.createBindGroup({
            "layout": bindGroupLayout,
            "entries": [
                {
                    "binding": 0,
                    "resource": sampler
                },
                {
                    "binding": 1,
                    "resource": atlasView
                }
            ]
        });
        $cachedAtlasView = atlasView;
    }

    // 描画
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setVertexBuffer(1, instanceBuffer);
    passEncoder.setBindGroup(0, $cachedBindGroup);
    passEncoder.draw(6, shaderManager.count, 0, 0);

    // レンダーパスを終了
    passEncoder.end();

    // インスタンスデータをクリア
    shaderManager.clear();

    return null;
};
