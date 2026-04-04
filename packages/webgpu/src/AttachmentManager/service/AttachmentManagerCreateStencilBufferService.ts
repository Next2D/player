import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";

/**
 * @description ステンシルバッファを新規作成
 *              Create a new stencil buffer
 *
 * @param  {GPUDevice} device - GPUデバイス
 * @param  {number} width - バッファ幅
 * @param  {number} height - バッファ高さ
 * @param  {{ stencilId: number }} id_counter - ID管理カウンタ
 * @return {IStencilBufferObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    width: number,
    height: number,
    id_counter: { stencilId: number }
): IStencilBufferObject => {
    const texture = device.createTexture({
        "size": { width, height },
        "format": "depth24plus-stencil8",
        "usage": GPUTextureUsage.RENDER_ATTACHMENT
    });

    return {
        "id": id_counter.stencilId++,
        "resource": texture,
        "view": texture.createView(),
        width,
        height,
        "area": width * height,
        "dirty": false
    };
};
