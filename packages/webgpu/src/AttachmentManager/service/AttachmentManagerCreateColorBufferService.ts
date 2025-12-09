import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";

/**
 * @description カラーバッファを新規作成
 *              Create a new color buffer
 *
 * @param  {GPUDevice} device
 * @param  {number} width
 * @param  {number} height
 * @param  {IStencilBufferObject} stencil
 * @return {IColorBufferObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    width: number,
    height: number,
    stencil: IStencilBufferObject
): IColorBufferObject => {
    const texture = device.createTexture({
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
};
