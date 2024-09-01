import type { ITextureObject } from "../../interface/ITextureObject";
import { $gl } from "../../WebGLUtil";

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
    $gl.deleteTexture(texture_object.resource);
};