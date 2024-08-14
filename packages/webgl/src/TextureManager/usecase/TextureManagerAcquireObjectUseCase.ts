import type { ITextureObject } from "../../interface/ITextureObject";
import { $objectPool } from "../../TextureManager";
import { execute as textureManagerCreateTextureObjectService } from "../service/TextureManagerCreateTextureObjectService";
import { execute as textureManagerInitializeBindService } from "../service/TextureManagerInitializeBindService";

/**
 * @description オブジェクトプールにTextureObjectがあれば再利用、なければ新規作成して返却します。
 *              If there is a TextureObject in the object pool, it will be reused,
 *              otherwise it will be created and returned.
 * 
 * @param  {number} width
 * @param  {number} height
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (width: number, height: number): ITextureObject =>
{

    if (!$objectPool.length) {
        const textureObject = textureManagerCreateTextureObjectService(width, height);
        textureManagerInitializeBindService(textureObject);
        return textureObject;
    }

    for (let idx: number = 0; idx < $objectPool.length; ++idx) {
        const textureObject = $objectPool[idx];
        if (textureObject.width !== width
            || textureObject.height !== height
        ) {
            continue;
        }

        $objectPool.splice(idx, 1);

        return textureObject;
    }

    return textureManagerCreateTextureObjectService(width, height);
};