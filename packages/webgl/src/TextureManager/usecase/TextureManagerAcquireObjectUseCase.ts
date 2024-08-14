import { ITextureObject } from "../../interface/ITextureObject";
import { $objectPool } from "../../TextureManager";
import { execute as textureManagerCreateTextureObjectService } from "../service/TextureManagerCreateTextureObjectService";

/**
 * @description オブジェクトプールにTextureObjectがあれば再利用、なければ新規作成して返却します。
 *              If there is a TextureObject in the object pool, it will be reused,
 *              otherwise it will be created and returned.
 * 
 * @param  {number} width
 * @param  {number} height
 * @param  {boolean} [smoothing=false]
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    width: number,
    height: number,
    smoothing: boolean = false
): ITextureObject => {

    if (!$objectPool.length) {
        return textureManagerCreateTextureObjectService(width, height, smoothing);
    }

    for (let idx: number = 0; idx < $objectPool.length; ++idx) {
        const textureObject = $objectPool[idx];
        if (textureObject.width !== width
            || textureObject.height !== height
        ) {
            continue;
        }

        $objectPool.splice(idx, 1);
        textureObject.smoothing = smoothing;

        return textureObject;
    }

    return textureManagerCreateTextureObjectService(width, height, smoothing);
};