import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as attachmentManagerCreateTextureObjectService } from "./AttachmentManagerCreateTextureObjectService";

/**
 * @description テクスチャオブジェクトを取得（プールから再利用または新規作成）
 *              Get texture object from pool or create new one
 *
 * @param  {GPUDevice} device - GPUデバイス
 * @param  {Map<string, ITextureObject[]>} texture_pool - テクスチャプール
 * @param  {number} width - テクスチャ幅
 * @param  {number} height - テクスチャ高さ
 * @param  {boolean} smooth - スムーズフィルタリングの有効フラグ
 * @param  {{ textureId: number }} id_counter - ID管理カウンタ
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    texture_pool: Map<string, ITextureObject[]>,
    width: number,
    height: number,
    smooth: boolean,
    id_counter: { textureId: number }
): ITextureObject => {
    const key = `${width}x${height}_${smooth ? "smooth" : "nearest"}`;

    // プールから再利用
    if (texture_pool.has(key)) {
        const pool = texture_pool.get(key)!;
        if (pool.length > 0) {
            return pool.pop()!;
        }
    }

    // 新規作成
    return attachmentManagerCreateTextureObjectService(device, width, height, smooth, id_counter);
};
