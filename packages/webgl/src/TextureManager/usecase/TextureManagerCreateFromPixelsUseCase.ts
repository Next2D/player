import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerGetTextureUseCase } from "./TextureManagerGetTextureUseCase";
import { $gl } from "../../WebGLUtil";

/**
 * @description ピクセルデータからテクスチャを作成します。
 *              Create a texture from pixel data.
 *
 * @param  {number} width
 * @param  {number} height
 * @param  {Uint8Array} pixels
 * @param  {boolean} [smooth=false]
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    width: number,
    height: number,
    pixels: Uint8Array,
    smooth: boolean = false
): ITextureObject => {

    const textureObject = textureManagerGetTextureUseCase(width, height, smooth);

    $gl.texSubImage2D(
        $gl.TEXTURE_2D, 0, 0, 0, width, height,
        $gl.RGBA, $gl.UNSIGNED_BYTE, pixels
    );

    return textureObject;
};