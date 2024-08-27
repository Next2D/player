import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerCreateTextureObjectService } from "../service/TextureManagerCreateTextureObjectService";
import { $activeTextureUnit } from "../../TextureManager";
import {
    $RENDER_MAX_SIZE,
    $gl
} from "../../WebGLUtil";

/**
 * @description アトラス専用のテクスチャを作成します。
 *              Create a texture for the atlas.
 * 
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (): ITextureObject =>
{
    const textureObject = textureManagerCreateTextureObjectService($RENDER_MAX_SIZE, $RENDER_MAX_SIZE);

    $gl.activeTexture($gl.TEXTURE3);
    $gl.bindTexture($gl.TEXTURE_2D, textureObject.resource);

    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_S, $gl.CLAMP_TO_EDGE);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_T, $gl.CLAMP_TO_EDGE);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MIN_FILTER, $gl.LINEAR);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MAG_FILTER, $gl.NEAREST);

    $gl.texStorage2D($gl.TEXTURE_2D, 1, $gl.RGBA8, textureObject.width, textureObject.height);

    $gl.activeTexture($activeTextureUnit !== -1 
        ? $activeTextureUnit
        : $gl.TEXTURE0
    ); 

    return textureObject;
};