import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { ITextureObject } from "./interface/ITextureObject";
import type { IColorBufferObject } from "./interface/IColorBufferObject";
import type { IStencilBufferObject } from "./interface/IStencilBufferObject";
import { execute as attachmentManagerGetAttachmentObjectUseCase } from "./AttachmentManager/usecase/AttachmentManagerGetAttachmentObjectUseCase";
import { execute as attachmentManagerReleaseAttachmentUseCase } from "./AttachmentManager/usecase/AttachmentManagerReleaseAttachmentUseCase";
import { execute as attachmentManagerCreateRenderPassDescriptorService } from "./AttachmentManager/service/AttachmentManagerCreateRenderPassDescriptorService";

/**
 * @description オフスクリーンレンダリング用アタッチメントマネージャー
 *              Attachment manager for offscreen rendering
 */
export class AttachmentManager
{
    private device: GPUDevice;
    private attachmentPool: IAttachmentObject[];
    private texturePool: Map<string, ITextureObject[]>;
    private colorBufferPool: IColorBufferObject[];
    private stencilBufferPool: IStencilBufferObject[];
    private idCounter: { attachmentId: number; textureId: number; stencilId: number };
    private currentAttachment: IAttachmentObject | null;

    /**
     * @param {GPUDevice} device
     * @constructor
     */
    constructor(device: GPUDevice)
    {
        this.device = device;
        this.attachmentPool = [];
        this.texturePool = new Map();
        this.colorBufferPool = [];
        this.stencilBufferPool = [];
        this.idCounter = { attachmentId: 0, textureId: 0, stencilId: 0 };
        this.currentAttachment = null;
    }

    /**
     * @description アタッチメントオブジェクトを取得
     * WebGL: FrameBufferManagerGetAttachmentObjectUseCase
     * @param {number} width
     * @param {number} height
     * @param {boolean} msaa - マルチサンプリング
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
     * @description アタッチメントをバインド（現在のアタッチメントとして設定）
     * WebGL: FrameBufferManagerBindAttachmentObjectService
     * @param {IAttachmentObject} attachment
     * @return {void}
     */
    bindAttachment(attachment: IAttachmentObject): void
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
     * @description 現在のアタッチメントオブジェクトを取得（プロパティ形式）
     *              Get the current attachment object (as property)
     *
     * @return {IAttachmentObject | null}
     * @readonly
     * @public
     */
    get currentAttachmentObject(): IAttachmentObject | null
    {
        return this.currentAttachment;
    }

    /**
     * @description アタッチメントをアンバインド
     * WebGL: FrameBufferManagerUnBindAttachmentObjectService
     * @return {void}
     */
    unbindAttachment(): void
    {
        this.currentAttachment = null;
    }

    /**
     * @description アタッチメントを解放してプールに返却
     * WebGL: FrameBufferManagerReleaseAttachmentObjectUseCase
     * @param {IAttachmentObject} attachment
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
     * @description レンダーパスディスクリプタを作成
     * @param {IAttachmentObject} attachment
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {GPULoadOp} loadOp
     * @return {GPURenderPassDescriptor}
     */
    createRenderPassDescriptor(
        attachment: IAttachmentObject,
        r: number,
        g: number,
        b: number,
        a: number,
        loadOp: GPULoadOp = "clear"
    ): GPURenderPassDescriptor
    {
        return attachmentManagerCreateRenderPassDescriptorService(
            attachment,
            r,
            g,
            b,
            a,
            loadOp
        );
    }

    /**
     * @description すべてのリソースを破棄
     * @return {void}
     */
    dispose(): void
    {
        // テクスチャプールを破棄
        for (const pool of this.texturePool.values()) {
            for (const textureObj of pool) {
                textureObj.resource.destroy();
            }
        }
        this.texturePool.clear();

        // カラーバッファプールを破棄
        for (const color of this.colorBufferPool) {
            color.resource.destroy();
        }
        this.colorBufferPool = [];

        // ステンシルバッファプールを破棄
        for (const stencil of this.stencilBufferPool) {
            stencil.resource.destroy();
        }
        this.stencilBufferPool = [];

        // アタッチメントプールを破棄
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
