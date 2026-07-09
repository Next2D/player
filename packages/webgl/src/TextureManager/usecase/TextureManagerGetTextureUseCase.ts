import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerCreateTextureObjectService } from "../service/TextureManagerCreateTextureObjectService";
import { execute as textureManagerInitializeBindService } from "../service/TextureManagerInitializeBindService";
import { execute as textureManagerReuseBindService } from "../service/TextureManagerReuseBindService";
import { $acquirePooledTexture } from "../../TextureManager";

/**
 * @description オブジェクトプールにTextureObjectがあれば再利用、なければ新規作成して返却します。
 *              再利用テクスチャは dirty=true のまま返却されるため、内容のゼロ初期化を
 *              前提とする呼び出し元(部分コピー等)は use_pool=false で新規テクスチャを取得すること。
 *              If there is a TextureObject in the object pool, it will be reused,
 *              otherwise it will be created and returned.
 *              Reused textures are returned with dirty=true. Callers that rely on
 *              zero-initialized contents (e.g. partial copies) must pass
 *              use_pool=false to get a freshly created texture.
 *
 * @param  {number} width
 * @param  {number} height
 * @param  {boolean} [smooth=false]
 * @param  {boolean} [use_pool=true]
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    width: number,
    height: number,
    smooth: boolean = false,
    use_pool: boolean = true
): ITextureObject => {

    if (use_pool) {
        const pooledTextureObject = $acquirePooledTexture(width, height);
        if (pooledTextureObject) {
            textureManagerReuseBindService(pooledTextureObject, smooth);
            return pooledTextureObject;
        }
    }

    const textureObject = textureManagerCreateTextureObjectService(width, height);
    textureManagerInitializeBindService(textureObject, smooth);
    return textureObject;
};
