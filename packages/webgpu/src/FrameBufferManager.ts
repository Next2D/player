import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { ITextureObject } from "./interface/ITextureObject";
import { execute as frameBufferManagerCreateAttachmentUseCase } from "./FrameBufferManager/usecase/FrameBufferManagerCreateAttachmentUseCase";
import { execute as frameBufferManagerReleaseTemporaryAttachmentUseCase } from "./FrameBufferManager/usecase/FrameBufferManagerReleaseTemporaryAttachmentUseCase";
import { execute as frameBufferManagerCreateRenderPassDescriptorService } from "./FrameBufferManager/service/FrameBufferManagerCreateRenderPassDescriptorService";
import { execute as frameBufferManagerCreateStencilRenderPassDescriptorService } from "./FrameBufferManager/service/FrameBufferManagerCreateStencilRenderPassDescriptorService";
import { TexturePool } from "./TexturePool";

export class FrameBufferManager
{
    private device: GPUDevice;
    private format: GPUTextureFormat;
    private attachments: Map<string, IAttachmentObject>;
    private currentAttachment: IAttachmentObject | null;
    private idCounter: { nextId: number; textureId: number; stencilId: number };
    private texturePool: TexturePool;
    private pendingReleases: IAttachmentObject[] = [];

    constructor(device: GPUDevice, format: GPUTextureFormat)
    {
        this.device = device;
        this.format = format;
        this.attachments = new Map();
        this.currentAttachment = null;
        this.idCounter = { "nextId": 1, "textureId": 1, "stencilId": 1 };
        this.texturePool = new TexturePool(device);
    }

    beginFrame(): void
    {
        this.texturePool.beginFrame();
    }

    createAttachment(
        name: string,
        width: number,
        height: number,
        msaa: boolean = false,
        mask: boolean = false
    ): IAttachmentObject
    {
        return frameBufferManagerCreateAttachmentUseCase(
            this.device,
            this.format,
            this.attachments,
            name,
            width,
            height,
            msaa,
            mask,
            this.idCounter
        );
    }

    getAttachment(name: string): IAttachmentObject | undefined
    {
        return this.attachments.get(name);
    }

    setCurrentAttachment(attachment: IAttachmentObject | null): void
    {
        this.currentAttachment = attachment;
    }

    getCurrentAttachment(): IAttachmentObject | null
    {
        return this.currentAttachment;
    }

    createRenderPassDescriptor(
        view: GPUTextureView,
        r: number = 0,
        g: number = 0,
        b: number = 0,
        a: number = 0,
        loadOp: GPULoadOp = "clear",
        resolveTarget: GPUTextureView | null = null
    ): GPURenderPassDescriptor {
        return frameBufferManagerCreateRenderPassDescriptorService(view, r, g, b, a, loadOp, resolveTarget);
    }

    createStencilRenderPassDescriptor(
        colorView: GPUTextureView,
        stencilView: GPUTextureView,
        colorLoadOp: GPULoadOp = "load",
        stencilLoadOp: GPULoadOp = "clear",
        resolveTarget: GPUTextureView | null = null
    ): GPURenderPassDescriptor {
        return frameBufferManagerCreateStencilRenderPassDescriptorService(
            colorView,
            stencilView,
            colorLoadOp,
            stencilLoadOp,
            resolveTarget
        );
    }

    destroyAttachment(name: string): void
    {
        const attachment = this.attachments.get(name);
        if (attachment) {
            if (attachment.texture) {
                attachment.texture.resource.destroy();
            }
            if (attachment.stencil) {
                attachment.stencil.resource.destroy();
            }
            this.attachments.delete(name);
        }
    }

    resizeAttachment(name: string, width: number, height: number): IAttachmentObject
    {
        this.destroyAttachment(name);
        return this.createAttachment(name, width, height);
    }

    createTemporaryAttachment(width: number, height: number): IAttachmentObject
    {
        const name = `temp_${this.idCounter.nextId}`;
        const usage = GPUTextureUsage.RENDER_ATTACHMENT |
                      GPUTextureUsage.TEXTURE_BINDING |
                      GPUTextureUsage.COPY_SRC |
                      GPUTextureUsage.COPY_DST |
                      GPUTextureUsage.STORAGE_BINDING;

        const gpuTexture = this.texturePool.acquire(width, height, "rgba8unorm", usage);
        const textureView = gpuTexture.createView();

        const texture: ITextureObject = {
            "id": this.idCounter.textureId++,
            "resource": gpuTexture,
            "view": textureView,
            width,
            height,
            "area": width * height,
            "smooth": true
        };

        const attachment: IAttachmentObject = {
            "id": this.idCounter.nextId++,
            width,
            height,
            "clipLevel": 0,
            "msaa": false,
            "mask": false,
            "color": null,
            texture,
            "stencil": null,
            "msaaTexture": null,
            "msaaStencil": null
        };

        this.attachments.set(name, attachment);
        return attachment;
    }

    releaseTemporaryAttachment(attachment: IAttachmentObject): void
    {
        frameBufferManagerReleaseTemporaryAttachmentUseCase(
            this.attachments,
            this.pendingReleases,
            attachment
        );
    }

    flushPendingReleases(): void
    {
        for (const att of this.pendingReleases) {
            if (att.texture) {
                this.texturePool.release(att.texture.resource);
            }
            if (att.msaaTexture) {
                att.msaaTexture.resource.destroy();
            }
            if (att.stencil) {
                att.stencil.resource.destroy();
            }
            if (att.msaaStencil) {
                att.msaaStencil.resource.destroy();
            }
        }
        this.pendingReleases = [];
    }

    dispose(): void
    {
        for (const attachment of this.attachments.values()) {
            if (attachment.texture) {
                attachment.texture.resource.destroy();
            }
            if (attachment.stencil) {
                attachment.stencil.resource.destroy();
            }
        }
        this.attachments.clear();
        this.currentAttachment = null;
        this.texturePool.dispose();
    }
}
