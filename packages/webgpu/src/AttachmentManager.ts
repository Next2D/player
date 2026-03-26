import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { ITextureObject } from "./interface/ITextureObject";
import type { IColorBufferObject } from "./interface/IColorBufferObject";
import type { IStencilBufferObject } from "./interface/IStencilBufferObject";
import { execute as attachmentManagerGetAttachmentObjectUseCase } from "./AttachmentManager/usecase/AttachmentManagerGetAttachmentObjectUseCase";
import { execute as attachmentManagerReleaseAttachmentUseCase } from "./AttachmentManager/usecase/AttachmentManagerReleaseAttachmentUseCase";

/**
 * @description アタッチメントリソースのプール管理クラス
 *              Pool manager class for attachment resources
 */
export class AttachmentManager
{
    private device: GPUDevice;
    private attachmentPool: IAttachmentObject[];
    private texturePool: Map<string, ITextureObject[]>;
    private colorBufferPool: IColorBufferObject[];
    private stencilBufferPool: IStencilBufferObject[];
    private idCounter: { attachmentId: number; textureId: number; stencilId: number };

    /**
     * @description AttachmentManagerのコンストラクタ
     *              Constructor for AttachmentManager
     * @param {GPUDevice} device - WebGPUデバイス / WebGPU device
     */
    constructor(device: GPUDevice)
    {
        this.device = device;
        this.attachmentPool = [];
        this.texturePool = new Map();
        this.colorBufferPool = [];
        this.stencilBufferPool = [];
        this.idCounter = { "attachmentId": 0, "textureId": 0, "stencilId": 0 };
    }

    /**
     * @description プールからアタッチメントオブジェクトを取得する
     *              Get an attachment object from the pool
     * @param  {number}  width  - テクスチャの幅 / Texture width
     * @param  {number}  height - テクスチャの高さ / Texture height
     * @param  {boolean} [msaa=false] - MSAAを有効にするか / Whether to enable MSAA
     * @return {IAttachmentObject}
     */
    getAttachmentObject(
        width: number,
        height: number,
        msaa: boolean = false
    ): IAttachmentObject
    {
        return attachmentManagerGetAttachmentObjectUseCase(
            this.device,
            this.attachmentPool,
            this.texturePool,
            this.colorBufferPool,
            this.stencilBufferPool,
            width,
            height,
            msaa,
            this.idCounter
        );
    }

    /**
     * @description 現在のアタッチメントをバインドする
     *              Bind the current attachment
     * @param  {IAttachmentObject} attachment - バインドするアタッチメント / Attachment to bind
     * @return {void}
     */
    bindAttachment(_attachment: IAttachmentObject): void
    {
        // no-op: バインド状態はContext側で管理
    }

    /**
     * @description 現在のアタッチメントのバインドを解除する
     *              Unbind the current attachment
     * @return {void}
     */
    unbindAttachment(): void
    {
        // no-op: バインド状態はContext側で管理
    }

    /**
     * @description アタッチメントをプールに返却する
     *              Release an attachment back to the pool
     * @param  {IAttachmentObject} attachment - 返却するアタッチメント / Attachment to release
     * @return {void}
     */
    releaseAttachment(attachment: IAttachmentObject): void
    {
        attachmentManagerReleaseAttachmentUseCase(
            this.attachmentPool,
            this.texturePool,
            this.colorBufferPool,
            this.stencilBufferPool,
            attachment
        );
    }

    /**
     * @description 全リソースを破棄する
     *              Dispose all resources
     * @return {void}
     */
    dispose(): void
    {
        for (const pool of this.texturePool.values()) {
            for (const textureObj of pool) {
                textureObj.resource.destroy();
            }
        }
        this.texturePool.clear();

        for (const color of this.colorBufferPool) {
            color.resource.destroy();
        }
        this.colorBufferPool = [];

        for (const stencil of this.stencilBufferPool) {
            stencil.resource.destroy();
        }
        this.stencilBufferPool = [];

        for (const attachment of this.attachmentPool) {
            if (attachment.texture) {
                attachment.texture.resource.destroy();
            }
            if (attachment.color) {
                attachment.color.resource.destroy();
            }
            if (attachment.stencil) {
                attachment.stencil.resource.destroy();
            }
        }
        this.attachmentPool = [];
    }
}
