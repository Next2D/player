import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IBlendMode } from "../../interface/IBlendMode";
import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { getInstancedShaderManager } from "../../Blend/BlendInstancedManager";
import { $getCurrentBlendMode } from "../../Blend";
import { renderQueue } from "@next2d/render-queue";
import {
    $isMaskTestEnabled,
    $getMaskStencilReference
} from "../../Mask";

/**
 * @description インスタンス配列を描画
 *              Draw instanced arrays
 *
 * @param {GPUDevice} device
 * @param {GPUCommandEncoder} commandEncoder
 * @param {GPURenderPassEncoder | null} renderPassEncoder - 現在のレンダーパス（必要に応じて終了される）
 * @param {IAttachmentObject} mainAttachment - メインアタッチメント（ステンシル付き）
 * @param {BufferManager} bufferManager
 * @param {FrameBufferManager} frameBufferManager
 * @param {TextureManager} textureManager
 * @param {PipelineManager} pipelineManager
 * @return {GPURenderPassEncoder | null} - 終了したレンダーパス
 */
export const execute = (
    device: GPUDevice,
    command_encoder: GPUCommandEncoder,
    render_pass_encoder: GPURenderPassEncoder | null,
    main_attachment: IAttachmentObject,
    buffer_manager: BufferManager,
    frame_buffer_manager: FrameBufferManager,
    _texture_manager: TextureManager,
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
    const blendMode: IBlendMode = $getCurrentBlendMode();

    // ブレンドモードに応じたパイプライン名を生成
    // simpleBlendModes: normal, layer, add, screen, alpha, erase, copy
    const getPipelineName = (mode: IBlendMode): string => {
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
            case "layer":
                return "instanced_copy";
            default:
                return "instanced_normal";
        }
    };

    const pipelineName = getPipelineName(blendMode);
    const normalPipeline = pipeline_manager.getPipeline(pipelineName);
    const maskedPipeline = pipeline_manager.getPipeline("instanced_masked");

    // 実際にマスクを使用するか判定
    // maskedパイプラインが存在し、マスクが有効で、ステンシルがある場合のみ
    const useStencil = isMasked && maskedPipeline && main_attachment.stencil?.view;

    const pipeline = useStencil ? maskedPipeline : normalPipeline;

    if (!pipeline) {
        console.error("[WebGPU] Instanced pipeline not found");
        return null;
    }

    // レンダーパスを作成（パイプラインに合わせてステンシルの有無を決定）
    let passEncoder: GPURenderPassEncoder;

    if (useStencil) {
        // ステンシル付きレンダーパス（マスク用）
        const renderPassDescriptor = frame_buffer_manager.createStencilRenderPassDescriptor(
            main_attachment.texture!.view,
            main_attachment.stencil!.view,
            "load", // カラーは既存の内容を保持
            "load"  // ステンシルも既存の内容を保持（マスク情報）
        );
        passEncoder = command_encoder.beginRenderPass(renderPassDescriptor);
    } else {
        // 通常のレンダーパス
        const renderPassDescriptor = frame_buffer_manager.createRenderPassDescriptor(
            main_attachment.texture!.view,
            0, 0, 0, 0,
            "load" // 既存の内容を保持
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

    // 頂点バッファ（矩形）を取得（プールから再利用）
    const vertices = buffer_manager.createRectVertices(0, 0, 1, 1);
    const vertexBuffer = buffer_manager.acquireVertexBuffer(vertices.byteLength, vertices);

    // アトラステクスチャをバインド
    const atlasAttachment = frame_buffer_manager.getAttachment("atlas");
    if (!atlasAttachment) {
        console.error("[WebGPU] Atlas attachment not found");
        passEncoder.end();
        return null;
    }

    // アトラス用サンプラーを作成（WebGL版と同様の設定）
    // MIN_FILTER: linear（縮小時・回転時にスムーズ）
    // MAG_FILTER: nearest（拡大時にシャープ）
    const sampler = device.createSampler({
        "minFilter": "linear",
        "magFilter": "nearest",
        "mipmapFilter": "nearest",
        "addressModeU": "clamp-to-edge",
        "addressModeV": "clamp-to-edge"
    });

    // バインドグループを作成
    const bindGroupLayout = pipeline_manager.getBindGroupLayout("instanced");
    if (!bindGroupLayout) {
        console.error("[WebGPU] Instanced bind group layout not found");
        passEncoder.end();
        return null;
    }

    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [
            {
                "binding": 0,
                "resource": sampler
            },
            {
                "binding": 1,
                "resource": atlasAttachment.texture!.view
            }
        ]
    });

    // 描画
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setVertexBuffer(1, instanceBuffer);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, shaderManager.count, 0, 0);

    // レンダーパスを終了
    passEncoder.end();

    // インスタンスデータをクリア
    shaderManager.clear();

    return null;
};
