import type { ITextureObject } from "../../interface/ITextureObject";

/**
 * @description テクスチャをプールに返却
 *              Release texture back to pool
 *
 * @param  {Map<string, ITextureObject[]>} texture_pool - テクスチャプール
 * @param  {ITextureObject} texture_object - 返却するテクスチャオブジェクト
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    texture_pool: Map<string, ITextureObject[]>,
    texture_object: ITextureObject
): void => {
    const key = `${texture_object.width}x${texture_object.height}_${texture_object.smooth ? "smooth" : "nearest"}`;

    if (!texture_pool.has(key)) {
        texture_pool.set(key, []);
    }

    texture_pool.get(key)!.push(texture_object);
};
