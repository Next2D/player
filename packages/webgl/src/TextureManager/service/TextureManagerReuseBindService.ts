import type { ITextureObject } from "../../interface/ITextureObject";
import { $gl } from "../../WebGLUtil";
import {
    $activeTextureUnit,
    $boundTextures,
    $setActiveTextureUnit
} from "../../TextureManager";

/**
 * @description プールから再利用したテクスチャをTEXTURE0にバインドします。
 *              texStorage2D は確保済みのため、フィルター設定の差分のみ反映します。
 *              Bind a texture reused from the pool to TEXTURE0.
 *              Storage is already allocated by texStorage2D, so only the
 *              filter settings are updated when they differ.
 *
 * @param  {ITextureObject} textrue_object
 * @param  {boolean} [smooth=false]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (textrue_object: ITextureObject, smooth: boolean = false): void =>
{
    if ($activeTextureUnit !== $gl.TEXTURE0) {
        $setActiveTextureUnit($gl.TEXTURE0);
        $gl.activeTexture($gl.TEXTURE0);
    }

    $boundTextures[0] = textrue_object;
    $gl.bindTexture($gl.TEXTURE_2D, textrue_object.resource);

    if (textrue_object.smooth !== smooth) {
        textrue_object.smooth = smooth;
        const filter = smooth ? $gl.LINEAR : $gl.NEAREST;
        $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MIN_FILTER, filter);
        $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MAG_FILTER, filter);
    }
};
