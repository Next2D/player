import type { ITextureObject } from "../../interface/ITextureObject";
import { $objectPool } from "../../TextureManager";
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
    if ($objectPool.indexOf(texture_object) > -1) {
        return ;
    }

    // プールに10個以上ある場合は削除
    if ($objectPool.length > 10) {
        $gl.deleteTexture(texture_object.resource);
        return;
    }

    $objectPool.push(texture_object);
};