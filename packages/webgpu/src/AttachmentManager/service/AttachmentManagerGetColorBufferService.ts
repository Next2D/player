import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute as attachmentManagerCreateColorBufferService } from "./AttachmentManagerCreateColorBufferService";

/**
 * @description カラーバッファを取得（プールから再利用または新規作成）
 *              Get color buffer from pool or create new one
 *
 * @param  {GPUDevice} device
 * @param  {IColorBufferObject[]} colorBufferPool
 * @param  {number} width
 * @param  {number} height
 * @param  {IStencilBufferObject} stencil
 * @return {IColorBufferObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    colorBufferPool: IColorBufferObject[],
    width: number,
    height: number,
    stencil: IStencilBufferObject
): IColorBufferObject => {
    // プールから適切なサイズのものを検索
    for (let i = 0; i < colorBufferPool.length; i++) {
        const buffer = colorBufferPool[i];
        if (buffer.width >= width && buffer.height >= height) {
            colorBufferPool.splice(i, 1);
            buffer.stencil = stencil;
            buffer.dirty = false;
            return buffer;
        }
    }

    // 新規作成
    return attachmentManagerCreateColorBufferService(device, width, height, stencil);
};
