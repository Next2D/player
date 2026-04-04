import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute as attachmentManagerCreateColorBufferService } from "./AttachmentManagerCreateColorBufferService";

/**
 * @description カラーバッファを取得（プールから再利用または新規作成）
 *              Get color buffer from pool or create new one
 *
 * @param  {GPUDevice} device - GPUデバイス
 * @param  {IColorBufferObject[]} color_buffer_pool - カラーバッファプール
 * @param  {number} width - バッファ幅
 * @param  {number} height - バッファ高さ
 * @param  {IStencilBufferObject} stencil - 関連するステンシルバッファ
 * @return {IColorBufferObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    color_buffer_pool: IColorBufferObject[],
    width: number,
    height: number,
    stencil: IStencilBufferObject
): IColorBufferObject => {
    // プールから適切なサイズのものを検索
    for (let i = 0; i < color_buffer_pool.length; i++) {
        const buffer = color_buffer_pool[i];
        if (buffer.width >= width && buffer.height >= height) {
            color_buffer_pool.splice(i, 1);
            buffer.stencil = stencil;
            buffer.dirty = false;
            return buffer;
        }
    }

    // 新規作成
    return attachmentManagerCreateColorBufferService(device, width, height, stencil);
};
