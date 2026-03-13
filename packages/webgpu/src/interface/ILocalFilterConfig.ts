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
    device: GPUDevice;
    commandEncoder: GPUCommandEncoder;
    bufferManager: BufferManager;
    frameBufferManager: FrameBufferManager;
    pipelineManager: PipelineManager;
    textureManager: TextureManager;
    mainAttachment?: IAttachmentObject;
    frameTextures: GPUTexture[];
}
