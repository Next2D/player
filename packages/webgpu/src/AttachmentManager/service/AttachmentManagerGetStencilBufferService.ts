import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute as attachmentManagerCreateStencilBufferService } from "./AttachmentManagerCreateStencilBufferService";

/**
 * @description ステンシルバッファを取得（プールから再利用または新規作成）
 *              Get stencil buffer from pool or create new one
 *
 * @param  {GPUDevice} device
 * @param  {IStencilBufferObject[]} stencilBufferPool
 * @param  {number} width
 * @param  {number} height
 * @param  {{ stencilId: number }} idCounter
 * @return {IStencilBufferObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    stencilBufferPool: IStencilBufferObject[],
    width: number,
    height: number,
    idCounter: { stencilId: number }
): IStencilBufferObject => {
    // プールから適切なサイズのものを検索
    for (let i = 0; i < stencilBufferPool.length; i++) {
        const buffer = stencilBufferPool[i];
        if (buffer.width >= width && buffer.height >= height) {
            stencilBufferPool.splice(i, 1);
            buffer.dirty = false;
            return buffer;
        }
    }

    // 新規作成
    return attachmentManagerCreateStencilBufferService(device, width, height, idCounter);
};
