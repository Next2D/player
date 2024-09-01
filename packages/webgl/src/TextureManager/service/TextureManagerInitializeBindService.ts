import type { ITextureObject } from "../../interface/ITextureObject";
import { $gl } from "../../WebGLUtil";
import {
    $activeTextureUnit,
    $boundTextures,
    $setActiveTextureUnit
} from "../../TextureManager";

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
    if ($activeTextureUnit !== $gl.TEXTURE0) {
        $setActiveTextureUnit($gl.TEXTURE0);
        $gl.activeTexture($gl.TEXTURE0);
    }

    $boundTextures[0] = textrue_object;
    $gl.bindTexture($gl.TEXTURE_2D, textrue_object.resource);

    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_S, $gl.CLAMP_TO_EDGE);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_T, $gl.CLAMP_TO_EDGE);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MIN_FILTER, $gl.NEAREST);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MAG_FILTER, $gl.NEAREST);

    // $gl.texStorage2D($gl.TEXTURE_2D, 1, $gl.RGBA8, textrue_object.width, textrue_object.height);

    const length = textrue_object.width * textrue_object.height * 4;
    const pixels = new Uint8Array(length);
    for (let idx = 0; idx < length; ) {
        pixels[idx++] = 255;
        pixels[idx++] = 0;
        pixels[idx++] = 0;
        pixels[idx++] = 255;
    }

    $gl.texImage2D($gl.TEXTURE_2D, 0, $gl.RGBA,
        textrue_object.width, textrue_object.height,
        0, $gl.RGBA, $gl.UNSIGNED_BYTE, pixels
    );
};