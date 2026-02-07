import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { ITextureObject } from "./interface/ITextureObject";
import { execute as frameBufferManagerCreateAttachmentUseCase } from "./FrameBufferManager/usecase/FrameBufferManagerCreateAttachmentUseCase";
import { execute as frameBufferManagerReleaseTemporaryAttachmentUseCase } from "./FrameBufferManager/usecase/FrameBufferManagerReleaseTemporaryAttachmentUseCase";
import { execute as frameBufferManagerCreateRenderPassDescriptorService } from "./FrameBufferManager/service/FrameBufferManagerCreateRenderPassDescriptorService";
import { execute as frameBufferManagerCreateStencilRenderPassDescriptorService } from "./FrameBufferManager/service/FrameBufferManagerCreateStencilRenderPassDescriptorService";
import { TexturePool } from "./TexturePool";

/**
 * @description WebGPUフレームバッファマネージャー
 *              WebGPU frame buffer manager
 */
export class FrameBufferManager
{
    private device: GPUDevice;
    private format: GPUTextureFormat;
    private attachments: Map<string, IAttachmentObject>;
    private currentAttachment: IAttachmentObject | null;
    private idCounter: { nextId: number; textureId: number; stencilId: number };
    private texturePool: TexturePool;

    /**
     * @description フレーム終了時に遅延解放するアタッチメント
     *              Attachments to be released at end of frame
     */
    private pendingReleases: IAttachmentObject[] = [];

    /**
     * @param {GPUDevice} device
     * @param {GPUTextureFormat} format
     * @constructor
     */
    constructor(device: GPUDevice, format: GPUTextureFormat)
    {
        this.device = device;
        this.format = format;
        this.attachments = new Map();
        this.currentAttachment = null;
        this.idCounter = { "nextId": 1, "textureId": 1, "stencilId": 1 };
        this.texturePool = new TexturePool(device);

        // 注意: アトラスはAtlasManagerが動的に管理する（複数アトラス対応）
        // 初期アトラスはAtlasManagerの$getAtlasAttachmentObject()で自動生成される
    }

    /**
     * @description フレーム開始時に呼び出し（テクスチャプールのクリーンアップ）
     *              Called at the beginning of each frame for texture pool maintenance
     * @return {void}
     */
    beginFrame(): void
    {
        this.texturePool.beginFrame();
    }

    /**
     * @description アタッチメントオブジェクトを作成
     * @param {string} name
     * @param {number} width
     * @param {number} height
     * @param {boolean} msaa
     * @param {boolean} mask
     * @return {IAttachmentObject}
     */
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

    /**
     * @description アタッチメントを取得
     * @param {string} name
     * @return {IAttachmentObject | undefined}
     */
    getAttachment(name: string): IAttachmentObject | undefined
    {
        return this.attachments.get(name);
    }

    /**
     * @description 現在のアタッチメントを設定
     * @param {IAttachmentObject | null} attachment
     * @return {void}
     */
    setCurrentAttachment(attachment: IAttachmentObject | null): void
    {
        this.currentAttachment = attachment;
    }

    /**
     * @description 現在のアタッチメントを取得
     * @return {IAttachmentObject | null}
     */
    getCurrentAttachment(): IAttachmentObject | null
    {
        return this.currentAttachment;
    }

    /**
     * @description レンダーパス記述子を作成
     * @param {GPUTextureView} view - テクスチャビュー（MSAAの場合はMSAAテクスチャビュー）
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {GPULoadOp} loadOp
     * @param {GPUTextureView | null} resolveTarget - MSAA解決先テクスチャビュー
     * @return {GPURenderPassDescriptor}
     */
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

    /**
     * @description ステンシル付きレンダーパス記述子を作成（2パスフィルレンダリング用）
     * @param {GPUTextureView} colorView - カラーテクスチャビュー（MSAAの場合はMSAAテクスチャビュー）
     * @param {GPUTextureView} stencilView - ステンシルテクスチャビュー（MSAAの場合はMSAAステンシルビュー）
     * @param {GPULoadOp} colorLoadOp - カラーのロードオペレーション
     * @param {GPULoadOp} stencilLoadOp - ステンシルのロードオペレーション
     * @param {GPUTextureView | null} resolveTarget - MSAA解決先テクスチャビュー
     * @return {GPURenderPassDescriptor}
     */
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

    /**
     * @description アタッチメントを削除
     * @param {string} name
     * @return {void}
     */
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

    /**
     * @description アタッチメントをリサイズ
     * @param {string} name
     * @param {number} width
     * @param {number} height
     * @return {IAttachmentObject}
     */
    resizeAttachment(name: string, width: number, height: number): IAttachmentObject
    {
        this.destroyAttachment(name);
        return this.createAttachment(name, width, height);
    }

    /**
     * @description 一時的なアタッチメントを作成（フィルター処理用）
     *              Creates a temporary attachment for filter processing
     * @param {number} width
     * @param {number} height
     * @return {IAttachmentObject}
     */
    createTemporaryAttachment(width: number, height: number): IAttachmentObject
    {
        const name = `temp_${this.idCounter.nextId}`;
        const usage = GPUTextureUsage.RENDER_ATTACHMENT |
                      GPUTextureUsage.TEXTURE_BINDING |
                      GPUTextureUsage.COPY_SRC |
                      GPUTextureUsage.COPY_DST;

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

    /**
     * @description 一時的なアタッチメントを解放（フィルター処理用）
     *              Releases a temporary attachment after filter processing
     *              テクスチャは即座に破棄せず、フレーム終了時に遅延解放します
     * @param {IAttachmentObject} attachment
     * @return {void}
     */
    releaseTemporaryAttachment(attachment: IAttachmentObject): void
    {
        frameBufferManagerReleaseTemporaryAttachmentUseCase(
            this.attachments,
            this.pendingReleases,
            attachment
        );
    }

    /**
     * @description フレーム終了時に保留中のテクスチャを解放
     *              Release pending textures at end of frame (after submit)
     * @return {void}
     */
    flushPendingReleases(): void
    {
        for (const att of this.pendingReleases) {
            if (att.texture) {
                this.texturePool.release(att.texture.resource);
            }
        }
        this.pendingReleases = [];
    }

    /**
     * @description すべてのリソースを解放
     * @return {void}
     */
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
