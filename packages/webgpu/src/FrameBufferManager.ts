import type { IAttachmentObject } from "./interface/IAttachmentObject";

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
    private nextId: number = 1;

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
        
        // アトラス用のテクスチャを初期化（4096x4096）
        const atlasSize = 4096;
        this.createAttachment("atlas", atlasSize, atlasSize);
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
        // アトラステクスチャはRGBA8フォーマットを使用（copyExternalImageToTextureとの互換性のため）
        const textureFormat = name === "atlas" ? "rgba8unorm" : this.format;

        const texture = this.device.createTexture({
            size: { width, height },
            format: textureFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT |
                   GPUTextureUsage.TEXTURE_BINDING |
                   GPUTextureUsage.COPY_SRC |
                   GPUTextureUsage.COPY_DST
        });

        const textureView = texture.createView();

        // アトラス用にステンシルテクスチャを作成（2パスフィルレンダリング用）
        let stencilTexture: GPUTexture | null = null;
        let stencilView: GPUTextureView | null = null;

        if (name === "atlas") {
            stencilTexture = this.device.createTexture({
                size: { width, height },
                format: "stencil8",
                usage: GPUTextureUsage.RENDER_ATTACHMENT
            });
            stencilView = stencilTexture.createView();
        }

        const attachment: IAttachmentObject = {
            id: this.nextId++,
            width,
            height,
            clipLevel: 0,
            msaa,
            mask,
            texture,
            textureView,
            color: null,
            stencil: null,
            colorTexture: null,
            stencilTexture,
            stencilView
        };

        this.attachments.set(name, attachment);
        return attachment;
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
     * @param {IAttachmentObject} attachment
     * @return {void}
     */
    setCurrentAttachment(attachment: IAttachmentObject): void
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
     * @param {GPUTextureView} view
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {GPULoadOp} loadOp
     * @return {GPURenderPassDescriptor}
     */
    createRenderPassDescriptor(
        view: GPUTextureView,
        r: number = 0,
        g: number = 0,
        b: number = 0,
        a: number = 0,
        loadOp: GPULoadOp = "clear"
    ): GPURenderPassDescriptor {
        return {
            colorAttachments: [{
                view: view,
                clearValue: { r, g, b, a },
                loadOp: loadOp,
                storeOp: "store"
            }]
        };
    }

    /**
     * @description ステンシル付きレンダーパス記述子を作成（2パスフィルレンダリング用）
     * @param {GPUTextureView} colorView - カラーテクスチャビュー
     * @param {GPUTextureView} stencilView - ステンシルテクスチャビュー
     * @param {GPULoadOp} colorLoadOp - カラーのロードオペレーション
     * @param {GPULoadOp} stencilLoadOp - ステンシルのロードオペレーション
     * @return {GPURenderPassDescriptor}
     */
    createStencilRenderPassDescriptor(
        colorView: GPUTextureView,
        stencilView: GPUTextureView,
        colorLoadOp: GPULoadOp = "load",
        stencilLoadOp: GPULoadOp = "clear"
    ): GPURenderPassDescriptor {
        return {
            colorAttachments: [{
                view: colorView,
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                loadOp: colorLoadOp,
                storeOp: "store"
            }],
            depthStencilAttachment: {
                view: stencilView,
                stencilClearValue: 0,
                stencilLoadOp: stencilLoadOp,
                stencilStoreOp: "store"
            }
        };
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
            attachment.texture.destroy();
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
        const name = `temp_${this.nextId}`;
        return this.createAttachment(name, width, height, false, false);
    }

    /**
     * @description 一時的なアタッチメントを解放（フィルター処理用）
     *              Releases a temporary attachment after filter processing
     * @param {IAttachmentObject} attachment
     * @return {void}
     */
    releaseTemporaryAttachment(attachment: IAttachmentObject): void
    {
        // 名前を検索して削除
        for (const [name, att] of this.attachments.entries()) {
            if (att.id === attachment.id) {
                att.texture.destroy();
                this.attachments.delete(name);
                break;
            }
        }
    }

    /**
     * @description すべてのリソースを解放
     * @return {void}
     */
    dispose(): void
    {
        for (const attachment of this.attachments.values()) {
            attachment.texture.destroy();
        }
        this.attachments.clear();
        this.currentAttachment = null;
    }
}
