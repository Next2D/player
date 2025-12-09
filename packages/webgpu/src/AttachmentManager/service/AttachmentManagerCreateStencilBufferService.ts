import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";

/**
 * @description ステンシルバッファを新規作成
 *              Create a new stencil buffer
 *
 * @param  {GPUDevice} device
 * @param  {number} width
 * @param  {number} height
 * @param  {{ stencilId: number }} idCounter
 * @return {IStencilBufferObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    width: number,
    height: number,
    idCounter: { stencilId: number }
): IStencilBufferObject => {
    const texture = device.createTexture({
        size: { width, height },
        format: "depth24plus-stencil8",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    });

    return {
        id: idCounter.stencilId++,
        resource: texture,
        view: texture.createView(),
        width,
        height,
        area: width * height,
        dirty: false
    };
};
