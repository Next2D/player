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
 * @param  {boolean} [smoothing=null] 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    index: number,
    unit: number,
    texture_object: ITextureObject | null = null,
    smoothing: boolean | null = null
): void => {

    const shouldBind   = texture_object !== $boundTextures[index];
    const shouldSmooth = smoothing !== null && texture_object !== null && smoothing !== texture_object.smoothing;
    const shouldActive = unit !== $activeTextureUnit && (shouldBind || shouldSmooth || unit === $gl.TEXTURE0);

    if (shouldActive) {
        $setActiveTextureUnit(unit);
        $gl.activeTexture(unit);
    }

    if (shouldBind) {
        $boundTextures[index] = texture_object;
        $gl.bindTexture($gl.TEXTURE_2D, texture_object ? texture_object.resource : null);
    }

    if (shouldSmooth) {

        if (texture_object) {
            texture_object.smoothing = !!smoothing;
        }

        const filter: number = smoothing ? $gl.LINEAR : $gl.NEAREST;
        $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MIN_FILTER, filter);
        $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MAG_FILTER, filter);
    }
};