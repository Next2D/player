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
    const textureObject = textureManagerCreateTextureObjectService(width, height);
    textureManagerInitializeBindService(textureObject);
    return textureObject;
};