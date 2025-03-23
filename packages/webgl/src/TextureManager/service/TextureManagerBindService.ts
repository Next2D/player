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
 * @param  {boolean} [smooth=false]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    index: number,
    unit: number,
    texture_object: ITextureObject | null = null,
    smooth: boolean = false
): void => {

    if ($activeTextureUnit === -1 || unit !== $activeTextureUnit) {
        $setActiveTextureUnit(unit);
        $gl.activeTexture(unit);
    }

    const boundTextures = $boundTextures[index];
    if (boundTextures !== null && texture_object !== null
        && boundTextures.id === texture_object.id
        || texture_object === boundTextures
    ) {
        return;
    }

    $boundTextures[index] = texture_object;
    $gl.bindTexture($gl.TEXTURE_2D, texture_object ? texture_object.resource : null);

    if (texture_object && texture_object.smooth !== smooth) {
        texture_object.smooth = smooth;
        $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MIN_FILTER, smooth ? $gl.LINEAR : $gl.NEAREST);
        $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MAG_FILTER, smooth ? $gl.LINEAR : $gl.NEAREST);
    }
};