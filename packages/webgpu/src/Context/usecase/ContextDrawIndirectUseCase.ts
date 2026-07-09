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

/**
 * @description キャッシュ済みバインドグループ
 *              Cached bind group
 */
let $cachedBindGroup: GPUBindGroup | null = null;
/**
 * @description キャッシュ済みアトラステクスチャビュー
 *              Cached atlas texture view
 */
let $cachedAtlasView: GPUTextureView | null = null;

/**
 * @description 開いたまま返却したインスタンスパスの作成時状態。
 *              次バッチが同一状態ならパスを再利用する(全画面MSAAリゾルブ削減)。
 *              State of the instanced pass that was returned open. The next
 *              batch reuses the pass when the state matches, avoiding a
 *              full-screen MSAA resolve per batch.
 */
let $openPassColorView: GPUTextureView | null = null;
let $openPassUseStencil: boolean = false;

/**
 * @description Indirect描画を使用したインスタンス描画を実行する
 *              Executes instanced drawing with indirect draw support
 * @param {GPUDevice} device GPUデバイス / GPU device
 * @param {GPUCommandEncoder} command_encoder コマンドエンコーダ / Command encoder
 * @param {GPURenderPassEncoder | null} render_pass_encoder レンダーパスエンコーダ / Render pass encoder
 * @param {IAttachmentObject} main_attachment メインアタッチメント / Main attachment
 * @param {BufferManager} buffer_manager バッファマネージャ / Buffer manager
 * @param {FrameBufferManager} frame_buffer_manager フレームバッファマネージャ / Frame buffer manager
 * @param {TextureManager} texture_manager テクスチャマネージャ / Texture manager
 * @param {PipelineManager} pipeline_manager パイプラインマネージャ / Pipeline manager
 * @param {boolean} use_indirect Indirect描画使用フラグ / Whether to use indirect drawing
 * @param {boolean} use_storage_buffer StorageBuffer使用フラグ / Whether to use storage buffer
 * @return {GPURenderPassEncoder | null} レンダーパスエンコーダまたはnull / Render pass encoder or null
 */
export const execute = (
    device: GPUDevice,
    command_encoder: GPUCommandEncoder,
    render_pass_encoder: GPURenderPassEncoder | null,
    main_attachment: IAttachmentObject,
    buffer_manager: BufferManager,
    frame_buffer_manager: FrameBufferManager,
    texture_manager: TextureManager,
    pipeline_manager: PipelineManager,
    use_indirect: boolean = true,
    use_storage_buffer: boolean = true,
    render_pass_is_instanced: boolean = false
): GPURenderPassEncoder | null => {
    const shaderManager = getInstancedShaderManager();

    if (shaderManager.count === 0) {
        return render_pass_encoder;
    }

    const isMasked = $isMaskTestEnabled();
    const maskReference = $getMaskStencilReference();

    // 現在のブレンドモードを取得
    const blendMode: IBlendMode = $currentBlendMode;

    // ブレンドモードに応じたパイプライン名を生成
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
                return "instanced_copy";
            default:
                // normal, layer
                return "instanced";
        }
    };

    const pipelineName = getPipelineName(blendMode);
    const normalPipeline = pipeline_manager.getPipeline(pipelineName);
    const maskedPipeline = pipeline_manager.getPipeline("instanced_masked");

    const useStencil = isMasked && maskedPipeline
        && (main_attachment.msaaStencil?.view || main_attachment.stencil?.view);

    const pipeline = useStencil ? maskedPipeline : normalPipeline;

    if (!pipeline) {
        console.error("[WebGPU] Instanced pipeline not found");
        return null;
    }

    // レンダーパスを作成(前回のインスタンスパスと状態が一致すれば再利用)
    const useMsaa = main_attachment.msaa && main_attachment.msaaTexture?.view;
    const colorView = useMsaa ? main_attachment.msaaTexture!.view : main_attachment.texture!.view;

    // リゾルブ遅延: 書き込みパスでは解決せず、読み手直前にまとめて解決する
    const resolveTarget = null;
    if (useMsaa) {
        main_attachment.msaaDirty = true;
    }
    const useStencilPass = Boolean(useStencil);

    let passEncoder: GPURenderPassEncoder;

    if (render_pass_encoder
        && render_pass_is_instanced
        && $openPassColorView === colorView
        && $openPassUseStencil === useStencilPass
    ) {
        // 同一アタッチメント・同一ステンシル構成の連続バッチ:
        // パスを閉じずにpipeline/バッファだけ差し替えて描画する。
        // パス終了ごとの全画面MSAAリゾルブとロード/ストア往復が消える。
        passEncoder = render_pass_encoder;
    } else {

        // 状態が異なる場合は既存のパスを終了して新規作成
        if (render_pass_encoder) {
            render_pass_encoder.end();
            render_pass_encoder = null;
        }

        if (useStencilPass) {
            // ステンシル付きレンダーパス（マスク用・MSAA対応）
            const stencilView = useMsaa && main_attachment.msaaStencil?.view
                ? main_attachment.msaaStencil.view : main_attachment.stencil!.view;

            const renderPassDescriptor = frame_buffer_manager.createStencilRenderPassDescriptor(
                colorView,
                stencilView,
                "load",
                "load",
                resolveTarget
            );
            passEncoder = command_encoder.beginRenderPass(renderPassDescriptor);
        } else {
            // 通常のレンダーパス（MSAA対応）
            const renderPassDescriptor = frame_buffer_manager.createRenderPassDescriptor(
                colorView,
                0, 0, 0, 0,
                "load",
                resolveTarget
            );
            passEncoder = command_encoder.beginRenderPass(renderPassDescriptor);
        }

        $openPassColorView   = colorView;
        $openPassUseStencil  = useStencilPass;
    }

    passEncoder.setPipeline(pipeline);

    if (useStencilPass) {
        passEncoder.setStencilReference(maskReference);
    }

    // インスタンスデータを準備
    const instanceData = new Float32Array(
        renderQueue.buffer.buffer,
        renderQueue.buffer.byteOffset,
        renderQueue.offset
    );

    // インスタンスバッファを作成または取得
    let instanceBuffer: GPUBuffer;
    if (use_storage_buffer) {
        // Storage Buffer最適化: プールから再利用してメモリアロケーション削減
        // Storage BufferはVERTEXフラグ付きで作成されているため、setVertexBufferで使用可能
        instanceBuffer = buffer_manager.acquireStorageBuffer(instanceData.byteLength);
        buffer_manager.writeStorageBuffer(instanceBuffer, instanceData);
    } else {
        // 従来方式: プールから再利用
        instanceBuffer = buffer_manager.acquireVertexBuffer(instanceData.byteLength, instanceData);
    }

    // 頂点バッファ（矩形）を取得（キャッシュ済み）
    const vertexBuffer = buffer_manager.getUnitRectBuffer();

    // アトラステクスチャをバインド（複数アトラス対応）
    // AtlasManagerから取得、フォールバックとしてFrameBufferManagerから取得
    const atlasAttachment = $getAtlasAttachmentObject() || frame_buffer_manager.getAttachment("atlas");
    if (!atlasAttachment) {
        console.error("[WebGPU] Atlas attachment not found");
        passEncoder.end();
        $openPassColorView = null;
        return null;
    }

    // アトラス用サンプラーを取得（キャッシュ済み）
    const sampler = texture_manager.createSampler("atlas_instanced_sampler", false);

    const bindGroupLayout = pipeline_manager.getBindGroupLayout("instanced");
    if (!bindGroupLayout) {
        console.error("[WebGPU] Instanced bind group layout not found");
        passEncoder.end();
        $openPassColorView = null;
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

    if (use_indirect) {
        // Indirect Drawing: CPU-GPU間のオーバーヘッドを削減
        // 注意: 1フレーム内で複数回呼び出される場合があるため、
        // 毎回新しいIndirect Bufferを作成する必要がある
        // （共有バッファを使うとqueue.writeBufferの更新が全てGPU実行前に行われ、
        // 全てのdrawIndirectが最後の更新値を使用してしまう）
        const indirectBuffer = buffer_manager.createIndirectBuffer(
            6,                    // vertexCount (2 triangles = 6 vertices)
            shaderManager.count,  // instanceCount
            0,                    // firstVertex
            0                     // firstInstance
        );
        passEncoder.drawIndirect(indirectBuffer, 0);
    } else {
        // 通常の描画
        passEncoder.draw(6, shaderManager.count, 0, 0);
    }

    // レンダーパスは終了せずに開いたまま返却する。
    // 次の連続バッチが同一状態ならこのパスを再利用し、
    // 異なる状態や他の描画経路が必要になった時点で呼び出し側が終了する。
    // (リゾルブはパス終了時に1回だけ行われるためピクセルは同一)

    // 注意: Storage Bufferはここで解放しない
    // GPUがまだ描画を実行していないため、同一フレーム内で再利用されると
    // データが上書きされてしまう。
    // フレーム終了時（clearFrameBuffers）でまとめて解放される。

    // インスタンスデータをクリア
    shaderManager.clear();

    return passEncoder;
};
