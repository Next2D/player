import type { ITextureObject } from "../../interface/ITextureObject";
import { $gl } from "../../WebGLUtil";
import { $activeTextureUnit } from "../../TextureManager";

/**
 * @description テクスチャの初期設定を行います。
 *              Initialize the texture.
 * 
 * @param  {ITextureObject} textrue_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (textrue_object: ITextureObject): void =>
{
    $gl.activeTexture($gl.TEXTURE3);
    $gl.bindTexture($gl.TEXTURE_2D, textrue_object.resource);

    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_S, $gl.CLAMP_TO_EDGE);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_T, $gl.CLAMP_TO_EDGE);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MIN_FILTER, $gl.NEAREST);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MAG_FILTER, $gl.NEAREST);

    $gl.texStorage2D($gl.TEXTURE_2D, 1, $gl.RGBA8, textrue_object.width, textrue_object.height);

    // reset
    $gl.bindTexture($gl.TEXTURE_2D, null);  
    $gl.activeTexture($activeTextureUnit === -1 ? $gl.TEXTURE0 : $activeTextureUnit);
};