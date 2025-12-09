import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as attachmentManagerCreateTextureObjectService } from "./AttachmentManagerCreateTextureObjectService";

/**
 * @description テクスチャオブジェクトを取得（プールから再利用または新規作成）
 *              Get texture object from pool or create new one
 *
 * @param  {GPUDevice} device
 * @param  {Map<string, ITextureObject[]>} texturePool
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
    texturePool: Map<string, ITextureObject[]>,
    width: number,
    height: number,
    smooth: boolean,
    idCounter: { textureId: number }
): ITextureObject => {
    const key = `${width}x${height}_${smooth ? "smooth" : "nearest"}`;

    // プールから再利用
    if (texturePool.has(key)) {
        const pool = texturePool.get(key)!;
        if (pool.length > 0) {
            return pool.pop()!;
        }
    }

    // 新規作成
    return attachmentManagerCreateTextureObjectService(device, width, height, smooth, idCounter);
};
