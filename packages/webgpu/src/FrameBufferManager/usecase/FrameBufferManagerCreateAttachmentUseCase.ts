import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";

/**
 * @description アタッチメントオブジェクトを作成
 *              Create attachment object
 *
 * @param  {GPUDevice} device
 * @param  {GPUTextureFormat} format
 * @param  {Map<string, IAttachmentObject>} attachments
 * @param  {string} name
 * @param  {number} width
 * @param  {number} height
 * @param  {boolean} msaa
 * @param  {boolean} mask
 * @param  {{ nextId: number, textureId: number, stencilId: number }} idCounter
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    format: GPUTextureFormat,
    attachments: Map<string, IAttachmentObject>,
    name: string,
    width: number,
    height: number,
    msaa: boolean,
    mask: boolean,
    idCounter: { nextId: number; textureId: number; stencilId: number }
): IAttachmentObject => {
    // アトラステクスチャはRGBA8フォーマットを使用（copyExternalImageToTextureとの互換性のため）
    const textureFormat = name === "atlas" ? "rgba8unorm" : format;

    const gpuTexture = device.createTexture({
        size: { width, height },
        format: textureFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT |
               GPUTextureUsage.TEXTURE_BINDING |
               GPUTextureUsage.COPY_SRC |
               GPUTextureUsage.COPY_DST
    });

    const textureView = gpuTexture.createView();

    // ITextureObject形式で格納
    const texture: ITextureObject = {
        id: idCounter.textureId++,
        resource: gpuTexture,
        view: textureView,
        width,
        height,
        area: width * height,
        smooth: true
    };

    // アトラス用にステンシルテクスチャを作成（2パスフィルレンダリング用）
    let stencil: IStencilBufferObject | null = null;

    if (name === "atlas") {
        const stencilTexture = device.createTexture({
            size: { width, height },
            format: "stencil8",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        const stencilView = stencilTexture.createView();

        stencil = {
            id: idCounter.stencilId++,
            resource: stencilTexture,
            view: stencilView,
            width,
            height,
            area: width * height,
            dirty: false
        };
    }

    const attachment: IAttachmentObject = {
        id: idCounter.nextId++,
        width,
        height,
        clipLevel: 0,
        msaa,
        mask,
        color: null,
        texture,
        stencil
    };

    attachments.set(name, attachment);
    return attachment;
};
