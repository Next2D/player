import type { IAttachmentObject } from "./IAttachmentObject";

/**
 * @description フィルター処理の共通設定
 *              Common filter processing configuration
 */
export interface IFilterConfig {
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
     * @description ユニフォームバッファの管理インターフェース
     *              Uniform buffer management interface
     */
    bufferManager?: {
        acquireUniformBuffer(requiredSize: number): GPUBuffer;
        acquireAndWriteUniformBuffer(data: Float32Array, byteLength?: number): GPUBuffer;
    };
    /**
     * @description フレームバッファの管理インターフェース
     *              Frame buffer management interface
     */
    frameBufferManager: {
        createTemporaryAttachment(width: number, height: number): IAttachmentObject;
        releaseTemporaryAttachment(attachment: IAttachmentObject): void;
        createRenderPassDescriptor(
            view: GPUTextureView,
            r: number, g: number, b: number, a: number,
            loadOp: GPULoadOp
        ): GPURenderPassDescriptor;
    };
    /**
     * @description パイプラインの管理インターフェース
     *              Pipeline management interface
     */
    pipelineManager: {
        getPipeline(name: string): GPURenderPipeline | undefined;
        getFilterPipeline(baseName: string, constants: Record<string, number>): GPURenderPipeline | undefined;
        getBindGroupLayout(name: string): GPUBindGroupLayout | undefined;
    };
    /**
     * @description テクスチャの管理インターフェース
     *              Texture management interface
     */
    textureManager: {
        createSampler(name: string, smooth: boolean): GPUSampler;
    };
    /**
     * @description フレームテクスチャの配列
     *              Array of frame textures
     */
    frameTextures: GPUTexture[];
}
