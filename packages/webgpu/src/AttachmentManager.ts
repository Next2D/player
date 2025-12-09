import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { ITextureObject } from "./interface/ITextureObject";
import type { IColorBufferObject } from "./interface/IColorBufferObject";
import type { IStencilBufferObject } from "./interface/IStencilBufferObject";

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
    private attachmentId: number;
    private textureId: number;
    private stencilId: number;
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
        this.attachmentId = 0;
        this.textureId = 0;
        this.stencilId = 0;
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
        attachment.width = width;
        attachment.height = height;
        attachment.msaa = msaa;
        attachment.mask = false;
        attachment.clipLevel = 0;

        // ステンシルバッファを取得または作成
        const stencil = this.getStencilBuffer(width, height);

        // カラーバッファを取得または作成（ステンシルを参照）
        const color = this.getColorBuffer(width, height, stencil);
        attachment.color = color;
        attachment.stencil = stencil;

        // テクスチャを取得
        const texture = this.getTexture(width, height, true);
        attachment.texture = texture;

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
            color: null,
            texture: null,
            stencil: null
        };
    }

    /**
     * @description カラーバッファを取得（プールから再利用または新規作成）
     * @param {number} width
     * @param {number} height
     * @param {IStencilBufferObject} stencil
     * @return {IColorBufferObject}
     * @private
     */
    private getColorBuffer(
        width: number,
        height: number,
        stencil: IStencilBufferObject
    ): IColorBufferObject
    {
        // プールから適切なサイズのものを検索
        for (let i = 0; i < this.colorBufferPool.length; i++) {
            const buffer = this.colorBufferPool[i];
            if (buffer.width >= width && buffer.height >= height) {
                this.colorBufferPool.splice(i, 1);
                buffer.stencil = stencil;
                buffer.dirty = false;
                return buffer;
            }
        }

        // 新規作成
        return this.createColorBuffer(width, height, stencil);
    }

    /**
     * @description カラーバッファを新規作成
     * @param {number} width
     * @param {number} height
     * @param {IStencilBufferObject} stencil
     * @return {IColorBufferObject}
     * @private
     */
    private createColorBuffer(
        width: number,
        height: number,
        stencil: IStencilBufferObject
    ): IColorBufferObject
    {
        const texture = this.device.createTexture({
            size: { width, height },
            format: "rgba8unorm",
            usage: GPUTextureUsage.RENDER_ATTACHMENT |
                   GPUTextureUsage.TEXTURE_BINDING |
                   GPUTextureUsage.COPY_SRC |
                   GPUTextureUsage.COPY_DST
        });

        return {
            resource: texture,
            view: texture.createView(),
            stencil,
            width,
            height,
            area: width * height,
            dirty: false
        };
    }

    /**
     * @description ステンシルバッファを取得（プールから再利用または新規作成）
     * @param {number} width
     * @param {number} height
     * @return {IStencilBufferObject}
     * @private
     */
    private getStencilBuffer(width: number, height: number): IStencilBufferObject
    {
        // プールから適切なサイズのものを検索
        for (let i = 0; i < this.stencilBufferPool.length; i++) {
            const buffer = this.stencilBufferPool[i];
            if (buffer.width >= width && buffer.height >= height) {
                this.stencilBufferPool.splice(i, 1);
                buffer.dirty = false;
                return buffer;
            }
        }

        // 新規作成
        return this.createStencilBuffer(width, height);
    }

    /**
     * @description ステンシルバッファを新規作成
     * @param {number} width
     * @param {number} height
     * @return {IStencilBufferObject}
     * @private
     */
    private createStencilBuffer(width: number, height: number): IStencilBufferObject
    {
        const texture = this.device.createTexture({
            size: { width, height },
            format: "depth24plus-stencil8",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });

        return {
            id: this.stencilId++,
            resource: texture,
            view: texture.createView(),
            width,
            height,
            area: width * height,
            dirty: false
        };
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
            resource: texture,
            view,
            width,
            height,
            area: width * height,
            smooth
        };
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
        // テクスチャをプールに返却
        if (attachment.texture) {
            this.releaseTexture(attachment.texture);
            attachment.texture = null;
        }

        // カラーバッファをプールに返却
        if (attachment.color) {
            this.colorBufferPool.push(attachment.color);
            attachment.color = null;
        }

        // ステンシルバッファをプールに返却
        if (attachment.stencil) {
            this.stencilBufferPool.push(attachment.stencil);
            attachment.stencil = null;
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
        // カラーアタッチメントはcolor.viewまたはtexture.viewを使用
        const colorView = attachment.color?.view ?? attachment.texture?.view;
        if (!colorView) {
            throw new Error("No color view available for render pass");
        }

        const colorAttachment: GPURenderPassColorAttachment = {
            view: colorView,
            loadOp,
            storeOp: "store",
            clearValue: { r, g, b, a }
        };

        const descriptor: GPURenderPassDescriptor = {
            colorAttachments: [colorAttachment]
        };

        // ステンシルアタッチメントを追加
        if (attachment.stencil?.view) {
            descriptor.depthStencilAttachment = {
                view: attachment.stencil.view,
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
