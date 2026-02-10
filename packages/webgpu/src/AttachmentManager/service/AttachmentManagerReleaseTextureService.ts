import type { ITextureObject } from "../../interface/ITextureObject";

/**
 * @description テクスチャをプールに返却
 *              Release texture back to pool
 *
 * @param  {Map<string, ITextureObject[]>} texturePool
 * @param  {ITextureObject} textureObject
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    texturePool: Map<string, ITextureObject[]>,
    textureObject: ITextureObject
): void => {
    const key = `${textureObject.width}x${textureObject.height}_${textureObject.smooth ? "smooth" : "nearest"}`;

    if (!texturePool.has(key)) {
        texturePool.set(key, []);
    }

    texturePool.get(key)!.push(textureObject);
};
