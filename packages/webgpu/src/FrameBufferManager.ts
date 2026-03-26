import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { ITextureObject } from "./interface/ITextureObject";
import { execute as frameBufferManagerCreateAttachmentUseCase } from "./FrameBufferManager/usecase/FrameBufferManagerCreateAttachmentUseCase";
import { execute as frameBufferManagerReleaseTemporaryAttachmentUseCase } from "./FrameBufferManager/usecase/FrameBufferManagerReleaseTemporaryAttachmentUseCase";
import { execute as frameBufferManagerCreateRenderPassDescriptorService } from "./FrameBufferManager/service/FrameBufferManagerCreateRenderPassDescriptorService";
import { execute as frameBufferManagerCreateStencilRenderPassDescriptorService } from "./FrameBufferManager/service/FrameBufferManagerCreateStencilRenderPassDescriptorService";
import { TexturePool } from "./TexturePool";

/**
 * @description フレームバッファとアタッチメントの管理クラス
 *              Manager class for frame buffers and attachments
 */
export class FrameBufferManager
{
    private device: GPUDevice;
    private format: GPUTextureFormat;
    private attachments: Map<string, IAttachmentObject>;
    private currentAttachment: IAttachmentObject | null;
    private idCounter: { nextId: number; textureId: number; stencilId: number };
    private texturePool: TexturePool;
    private pendingReleases: IAttachmentObject[] = [];

    /**
     * @description FrameBufferManagerのコンストラクタ
     *              Constructor for FrameBufferManager
     * @param {GPUDevice}        device - WebGPUデバイス / WebGPU device
     * @param {GPUTextureFormat} format - テクスチャフォーマット / Texture format
     */
    constructor(device: GPUDevice, format: GPUTextureFormat)
    {
        this.device = device;
        this.format = format;
        this.attachments = new Map();
        this.currentAttachment = null;
        this.idCounter = { "nextId": 1, "textureId": 1, "stencilId": 1 };
        this.texturePool = new TexturePool(device);
    }

    /**
     * @description フレームの開始処理を行う
     *              Begin a new frame
     * @return {void}
     */
    beginFrame(): void
    {
        this.texturePool.beginFrame();
    }

    /**
     * @description 新しいアタッチメントを作成する
     *              Create a new attachment
     * @param  {string}  name   - アタッチメント名 / Attachment name
     * @param  {number}  width  - テクスチャの幅 / Texture width
     * @param  {number}  height - テクスチャの高さ / Texture height
     * @param  {boolean} [msaa=false] - MSAAを有効にするか / Whether to enable MSAA
     * @param  {boolean} [mask=false] - マスクを有効にするか / Whether to enable mask
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
     * @description 名前でアタッチメントを取得する
     *              Get an attachment by name
     * @param  {string} name - アタッチメント名 / Attachment name
     * @return {IAttachmentObject | undefined}
     */
    getAttachment(name: string): IAttachmentObject | undefined
    {
        return this.attachments.get(name);
    }

    /**
     * @description 現在のアタッチメントを設定する
     *              Set the current attachment
     * @param  {IAttachmentObject | null} attachment - 設定するアタッチメント / Attachment to set
     * @return {void}
     */
    setCurrentAttachment(attachment: IAttachmentObject | null): void
    {
        this.currentAttachment = attachment;
    }

    /**
     * @description 現在のアタッチメントを取得する
     *              Get the current attachment
     * @return {IAttachmentObject | null}
     */
    getCurrentAttachment(): IAttachmentObject | null
    {
        return this.currentAttachment;
    }

    /**
     * @description レンダーパスディスクリプタを作成する
     *              Create a render pass descriptor
     * @param  {GPUTextureView}      view                  - カラーテクスチャビュー / Color texture view
     * @param  {number}              [r=0]                 - クリアカラーR値 / Clear color R value
     * @param  {number}              [g=0]                 - クリアカラーG値 / Clear color G value
     * @param  {number}              [b=0]                 - クリアカラーB値 / Clear color B value
     * @param  {number}              [a=0]                 - クリアカラーA値 / Clear color A value
     * @param  {GPULoadOp}           [load_op="clear"]     - ロードオペレーション / Load operation
     * @param  {GPUTextureView|null} [resolve_target=null] - MSAAリゾルブターゲット / MSAA resolve target
     * @return {GPURenderPassDescriptor}
     */
    createRenderPassDescriptor(
        view: GPUTextureView,
        r: number = 0,
        g: number = 0,
        b: number = 0,
        a: number = 0,
        load_op: GPULoadOp = "clear",
        resolve_target: GPUTextureView | null = null
    ): GPURenderPassDescriptor {
        return frameBufferManagerCreateRenderPassDescriptorService(view, r, g, b, a, load_op, resolve_target);
    }

    /**
     * @description ステンシル付きレンダーパスディスクリプタを作成する
     *              Create a render pass descriptor with stencil
     * @param  {GPUTextureView}      color_view                - カラーテクスチャビュー / Color texture view
     * @param  {GPUTextureView}      stencil_view              - ステンシルテクスチャビュー / Stencil texture view
     * @param  {GPULoadOp}           [color_load_op="load"]    - カラーロードオペレーション / Color load operation
     * @param  {GPULoadOp}           [stencil_load_op="clear"] - ステンシルロードオペレーション / Stencil load operation
     * @param  {GPUTextureView|null} [resolve_target=null]     - MSAAリゾルブターゲット / MSAA resolve target
     * @return {GPURenderPassDescriptor}
     */
    createStencilRenderPassDescriptor(
        color_view: GPUTextureView,
        stencil_view: GPUTextureView,
        color_load_op: GPULoadOp = "load",
        stencil_load_op: GPULoadOp = "clear",
        resolve_target: GPUTextureView | null = null
    ): GPURenderPassDescriptor {
        return frameBufferManagerCreateStencilRenderPassDescriptorService(
            color_view,
            stencil_view,
            color_load_op,
            stencil_load_op,
            resolve_target
        );
    }

    /**
     * @description アタッチメントを破棄する
     *              Destroy an attachment by name
     * @param  {string} name - アタッチメント名 / Attachment name
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
     * @description 一時的なアタッチメントを作成する
     *              Create a temporary attachment
     * @param  {number} width  - テクスチャの幅 / Texture width
     * @param  {number} height - テクスチャの高さ / Texture height
     * @return {IAttachmentObject}
     */
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

    /**
     * @description 一時アタッチメントをリリースキューに追加する
     *              Add a temporary attachment to the release queue
     * @param  {IAttachmentObject} attachment - リリースするアタッチメント / Attachment to release
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
     * @description 保留中のリリースを実行する
     *              Flush all pending releases
     * @return {void}
     */
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

    /**
     * @description 全リソースを破棄する
     *              Dispose all resources
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
