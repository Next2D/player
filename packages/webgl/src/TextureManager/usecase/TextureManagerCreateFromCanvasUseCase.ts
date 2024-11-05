import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerGetTextureUseCase } from "./TextureManagerGetTextureUseCase";
import { $gl } from "../../WebGLUtil";

/**
 * @description OffscreenCanvasからテクスチャを作成します。
 *              Create a texture from OffscreenCanvas data.
 *
 * @param  {number} width
 * @param  {number} height
 * @param  {OffscreenCanvas} canvas
 * @param  {boolean} [smooth=false]
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    width: number,
    height: number,
    canvas: OffscreenCanvas,
    smooth: boolean = false
): ITextureObject => {

    const textureObject = textureManagerGetTextureUseCase(width, height, smooth);

    $gl.texSubImage2D(
        $gl.TEXTURE_2D, 0, 0, 0,
        $gl.RGBA, $gl.UNSIGNED_BYTE, canvas
    );

    return textureObject;
};