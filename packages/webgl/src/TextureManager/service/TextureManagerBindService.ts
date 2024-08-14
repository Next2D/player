import type { ITextureObject } from "../../interface/ITextureObject";
import { $gl } from "../../WebGLUtil";
import {
    $activeTextureUnit,
    $boundTextures,
    $setActiveTextureUnit
} from "../../TextureManager";

/**
 * @description 指定のunitにテクスチャをバインドします。nullの場合はバインドを解除します。
 *              Binds a texture to the specified unit. If null, the binding is released.
 * 
 * @param  {number} index 
 * @param  {number} unit 
 * @param  {ITextureObject} [texture_object=null] 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    index: number,
    unit: number,
    texture_object: ITextureObject | null = null
): void => {

    if ($activeTextureUnit === -1 || unit !== $activeTextureUnit) {
        $setActiveTextureUnit(unit);
        $gl.activeTexture(unit);
    }

    if (texture_object !== $boundTextures[index]) {
        $boundTextures[index] = texture_object;
        $gl.bindTexture($gl.TEXTURE_2D, texture_object ? texture_object.resource : null);
    }
};