import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { ITextureObject } from "./interface/ITextureObject";
import type { IColorBufferObject } from "./interface/IColorBufferObject";
import type { IStencilBufferObject } from "./interface/IStencilBufferObject";
import { execute as attachmentManagerGetAttachmentObjectUseCase } from "./AttachmentManager/usecase/AttachmentManagerGetAttachmentObjectUseCase";
import { execute as attachmentManagerReleaseAttachmentUseCase } from "./AttachmentManager/usecase/AttachmentManagerReleaseAttachmentUseCase";

export class AttachmentManager
{
    private device: GPUDevice;
    private attachmentPool: IAttachmentObject[];
    private texturePool: Map<string, ITextureObject[]>;
    private colorBufferPool: IColorBufferObject[];
    private stencilBufferPool: IStencilBufferObject[];
    private idCounter: { attachmentId: number; textureId: number; stencilId: number };
    private currentAttachment: IAttachmentObject | null;

    constructor(device: GPUDevice)
    {
        this.device = device;
        this.attachmentPool = [];
        this.texturePool = new Map();
        this.colorBufferPool = [];
        this.stencilBufferPool = [];
        this.idCounter = { "attachmentId": 0, "textureId": 0, "stencilId": 0 };
        this.currentAttachment = null;
    }

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

    bindAttachment(attachment: IAttachmentObject): void
    {
        this.currentAttachment = attachment;
    }

    unbindAttachment(): void
    {
        this.currentAttachment = null;
    }

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
