import type { IAttachmentObject } from "./IAttachmentObject";
import type { ComputePipelineManager } from "../Compute/ComputePipelineManager";

/**
 * @description フィルター処理の共通設定
 *              Common filter processing configuration
 */
export interface IFilterConfig {
    device: GPUDevice;
    commandEncoder: GPUCommandEncoder;
    bufferManager?: {
        acquireUniformBuffer(requiredSize: number): GPUBuffer;
    };
    frameBufferManager: {
        createTemporaryAttachment(width: number, height: number): IAttachmentObject;
        releaseTemporaryAttachment(attachment: IAttachmentObject): void;
        createRenderPassDescriptor(
            view: GPUTextureView,
            r: number, g: number, b: number, a: number,
            loadOp: GPULoadOp
        ): GPURenderPassDescriptor;
    };
    pipelineManager: {
        getPipeline(name: string): GPURenderPipeline | undefined;
        getBindGroupLayout(name: string): GPUBindGroupLayout | undefined;
    };
    textureManager: {
        createSampler(name: string, smooth: boolean): GPUSampler;
    };
    computePipelineManager?: ComputePipelineManager;
}
