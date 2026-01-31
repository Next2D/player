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
    frameBufferManager: FrameBufferManager;
    pipelineManager: PipelineManager;
    textureManager: TextureManager;
}
