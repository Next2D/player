import type { ITextureObject } from "../../interface/ITextureObject";
import { $gl } from "../../WebGLUtil";
import { $boundTextures } from "../../TextureManager";

/**
 * @description TextureObjectをオブジェクトプールに保管、サイズオーバー時は削除します。
 *              Stores the TextureObject in the object pool and deletes it if it exceeds the size.
 *
 * @param  {ITextureObject} texture_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (texture_object: ITextureObject): void =>
{
    for (let idx = 0; idx < $boundTextures.length; ++idx) {
        if ($boundTextures[idx] === texture_object) {
            $boundTextures[idx] = null;
        }
    }
    $gl.deleteTexture(texture_object.resource);
};
