import type { IAttachmentObject } from "./IAttachmentObject";
import type { BufferManager } from "../BufferManager";
import type { FrameBufferManager } from "../FrameBufferManager";
import type { PipelineManager } from "../Shader/PipelineManager";
import type { TextureManager } from "../TextureManager";

/**
 * @description フィルター適用時のローカル設定（ContextApplyFilterUseCase用）
 *              Local filter configuration for ContextApplyFilterUseCase
 */
export interface ILocalFilterConfig {
    /**
     * @description GPUデバイス
     *              GPU device instance
     */
    device: GPUDevice;
    /**
     * @description GPUコマンドエンコーダー
     *              GPU command encoder
     */
    commandEncoder: GPUCommandEncoder;
    /**
     * @description バッファマネージャー
     *              Buffer manager instance
     */
    bufferManager: BufferManager;
    /**
     * @description フレームバッファマネージャー
     *              Frame buffer manager instance
     */
    frameBufferManager: FrameBufferManager;
    /**
     * @description パイプラインマネージャー
     *              Pipeline manager instance
     */
    pipelineManager: PipelineManager;
    /**
     * @description テクスチャマネージャー
     *              Texture manager instance
     */
    textureManager: TextureManager;
    /**
     * @description メインのアタッチメントオブジェクト（任意）
     *              Main attachment object (optional)
     */
    mainAttachment?: IAttachmentObject;
    /**
     * @description フレームテクスチャの配列
     *              Array of frame textures
     */
    frameTextures: GPUTexture[];
}
