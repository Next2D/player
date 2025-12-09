import type { ITextureObject } from "../../interface/ITextureObject";

/**
 * @description テクスチャオブジェクトを新規作成
 *              Create a new texture object
 *
 * @param  {GPUDevice} device
 * @param  {number} width
 * @param  {number} height
 * @param  {boolean} smooth
 * @param  {{ textureId: number }} idCounter
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    width: number,
    height: number,
    smooth: boolean,
    idCounter: { textureId: number }
): ITextureObject => {
    const texture = device.createTexture({
        size: { width, height },
        format: "rgba8unorm",
        usage: GPUTextureUsage.RENDER_ATTACHMENT |
               GPUTextureUsage.TEXTURE_BINDING |
               GPUTextureUsage.COPY_SRC |
               GPUTextureUsage.COPY_DST
    });

    const view = texture.createView();

    return {
        id: idCounter.textureId++,
        resource: texture,
        view,
        width,
        height,
        area: width * height,
        smooth
    };
};
