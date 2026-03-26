import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute as attachmentManagerCreateStencilBufferService } from "./AttachmentManagerCreateStencilBufferService";

/**
 * @description ステンシルバッファを取得（プールから再利用または新規作成）
 *              Get stencil buffer from pool or create new one
 *
 * @param  {GPUDevice} device - GPUデバイス
 * @param  {IStencilBufferObject[]} stencil_buffer_pool - ステンシルバッファプール
 * @param  {number} width - バッファ幅
 * @param  {number} height - バッファ高さ
 * @param  {{ stencilId: number }} id_counter - ID管理カウンタ
 * @return {IStencilBufferObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    stencil_buffer_pool: IStencilBufferObject[],
    width: number,
    height: number,
    id_counter: { stencilId: number }
): IStencilBufferObject => {
    // プールから適切なサイズのものを検索
    for (let i = 0; i < stencil_buffer_pool.length; i++) {
        const buffer = stencil_buffer_pool[i];
        if (buffer.width >= width && buffer.height >= height) {
            stencil_buffer_pool.splice(i, 1);
            buffer.dirty = false;
            return buffer;
        }
    }

    // 新規作成
    return attachmentManagerCreateStencilBufferService(device, width, height, id_counter);
};
