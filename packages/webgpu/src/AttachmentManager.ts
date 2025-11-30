import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { ITextureObject } from "./interface/ITextureObject";

/**
 * @description オフスクリーンレンダリング用アタッチメントマネージャー
 *              Attachment manager for offscreen rendering
 */
export class AttachmentManager
{
    private device: GPUDevice;
    private attachmentPool: IAttachmentObject[];
    private texturePool: Map<string, ITextureObject[]>;
    private attachmentId: number;
    private textureId: number;
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
        this.attachmentId = 0;
        this.textureId = 0;
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
        // プールから再利用
        const attachment = this.attachmentPool.length > 0
            ? this.attachmentPool.pop()!
            : this.createAttachmentObject();

        // サイズとフラグを更新
        (attachment as any).width = width;
        (attachment as any).height = height;
        (attachment as any).msaa = msaa;
        (attachment as any).mask = false;
        (attachment as any).clipLevel = 0;

        // カラーテクスチャを取得
        const colorTexture = this.getTexture(width, height, true);
        (attachment as any).colorTexture = colorTexture;

        // ステンシルテクスチャを作成
        const stencilTexture = this.createStencilTexture(width, height);
        const stencilView = stencilTexture.createView();
        (attachment as any).stencilTexture = stencilTexture;
        (attachment as any).stencilView = stencilView;

        return attachment;
    }

    /**
     * @description 新しいアタッチメントオブジェクトを作成
     * @return {IAttachmentObject}
     * @private
     */
    private createAttachmentObject(): IAttachmentObject
    {
        return {
            id: this.attachmentId++,
            width: 0,
            height: 0,
            clipLevel: 0,
            msaa: false,
            mask: false,
            texture: null as any,
            textureView: null as any,
            color: null,
            stencil: null,
            colorTexture: null,
            stencilTexture: null,
            stencilView: null
        } as any;
    }

    /**
     * @description テクスチャオブジェクトを取得（プールから再利用または新規作成）
     * @param {number} width
     * @param {number} height
     * @param {boolean} smooth
     * @return {ITextureObject}
     * @private
     */
    private getTexture(width: number, height: number, smooth: boolean): ITextureObject
    {
        const key = `${width}x${height}_${smooth ? "smooth" : "nearest"}`;
        
        // プールから再利用
        if (this.texturePool.has(key)) {
            const pool = this.texturePool.get(key)!;
            if (pool.length > 0) {
                return pool.pop()!;
            }
        }

        // 新規作成
        return this.createTextureObject(width, height, smooth);
    }

    /**
     * @description テクスチャオブジェクトを新規作成
     * @param {number} width
     * @param {number} height
     * @param {boolean} smooth
     * @return {ITextureObject}
     * @private
     */
    private createTextureObject(width: number, height: number, smooth: boolean): ITextureObject
    {
        const texture = this.device.createTexture({
            size: { width, height },
            format: "rgba8unorm",
            usage: GPUTextureUsage.RENDER_ATTACHMENT |
                   GPUTextureUsage.TEXTURE_BINDING |
                   GPUTextureUsage.COPY_SRC |
                   GPUTextureUsage.COPY_DST
        });

        const view = texture.createView();

        return {
            id: this.textureId++,
            texture,
            view,
            width,
            height,
            area: width * height,
            smooth
        };
    }

    /**
     * @description ステンシルテクスチャを作成
     * @param {number} width
     * @param {number} height
     * @return {GPUTexture}
     * @private
     */
    private createStencilTexture(width: number, height: number): GPUTexture
    {
        return this.device.createTexture({
            size: { width, height },
            format: "depth24plus-stencil8",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
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
        // カラーテクスチャをプールに返却
        if (attachment.colorTexture) {
            this.releaseTexture(attachment.colorTexture);
            (attachment as any).colorTexture = null;
        }

        // ステンシルテクスチャを破棄（再利用しない）
        if (attachment.stencilTexture) {
            attachment.stencilTexture.destroy();
            (attachment as any).stencilTexture = null;
            (attachment as any).stencilView = null;
        }

        // アタッチメントをプールに返却
        this.attachmentPool.push(attachment);
    }

    /**
     * @description テクスチャをプールに返却
     * @param {ITextureObject} textureObject
     * @return {void}
     * @private
     */
    private releaseTexture(textureObject: ITextureObject): void
    {
        const key = `${textureObject.width}x${textureObject.height}_${textureObject.smooth ? "smooth" : "nearest"}`;
        
        if (!this.texturePool.has(key)) {
            this.texturePool.set(key, []);
        }
        
        this.texturePool.get(key)!.push(textureObject);
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
        const colorAttachment: GPURenderPassColorAttachment = {
            view: attachment.colorTexture!.view,
            loadOp,
            storeOp: "store",
            clearValue: { r, g, b, a }
        };

        const descriptor: GPURenderPassDescriptor = {
            colorAttachments: [colorAttachment]
        };

        // ステンシルアタッチメントを追加
        if (attachment.stencilView) {
            descriptor.depthStencilAttachment = {
                view: attachment.stencilView,
                depthLoadOp: "clear",
                depthStoreOp: "store",
                depthClearValue: 1.0,
                stencilLoadOp: "clear",
                stencilStoreOp: "store",
                stencilClearValue: 0
            };
        }

        return descriptor;
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
                textureObj.texture.destroy();
            }
        }
        this.texturePool.clear();

        // アタッチメントプールを破棄
        for (const attachment of this.attachmentPool) {
            if (attachment.colorTexture) {
                attachment.colorTexture.texture.destroy();
            }
            if (attachment.stencilTexture) {
                attachment.stencilTexture.destroy();
            }
        }
        this.attachmentPool = [];
    }
}
