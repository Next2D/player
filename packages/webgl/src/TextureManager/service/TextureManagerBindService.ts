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

    if ($activeTextureUnit !== unit) {
        $setActiveTextureUnit(unit);
        $gl.activeTexture(unit);
    }

    const boundTexture = $boundTextures[index];
    if (boundTexture === texture_object) {
        // Same reference, already bound to this unit.
        return;
    }
    if (boundTexture !== null
        && texture_object !== null
        && boundTexture.id === texture_object.id
    ) {
        return;
    }

    $boundTextures[index] = texture_object;
    $gl.bindTexture($gl.TEXTURE_2D, texture_object ? texture_object.resource : null);

    if (texture_object && texture_object.smooth !== smooth) {
        texture_object.smooth = smooth;
        const filter = smooth ? $gl.LINEAR : $gl.NEAREST;
        $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MIN_FILTER, filter);
        $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MAG_FILTER, filter);
    }
};