import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerCreateTextureObjectService } from "../service/TextureManagerCreateTextureObjectService";
import { $activeTextureUnit } from "../../TextureManager";
import {
    $RENDER_MAX_SIZE,
    $gl
} from "../../WebGLUtil";

/**
 * @description アトラス専用のテクスチャ(TEXTURE_2D_ARRAY)を作成します。
 *              1ページ=1レイヤーとして解決することで、複数ページを1バッチで
 *              サンプリングでき、ページ切替によるバッチ分断が発生しない。
 *              テクスチャユニット3に常時バインドされる。
 *              Create the atlas texture (TEXTURE_2D_ARRAY). Each page resolves
 *              into its own layer so a single batch can sample multiple pages
 *              without breaking on page switches. Permanently bound to
 *              texture unit 3.
 *
 * @param  {number} [layers=1]
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (layers: number = 1): ITextureObject =>
{
    const textureObject = textureManagerCreateTextureObjectService($RENDER_MAX_SIZE, $RENDER_MAX_SIZE);

    $gl.activeTexture($gl.TEXTURE3);
    $gl.bindTexture($gl.TEXTURE_2D_ARRAY, textureObject.resource);

    $gl.texParameteri($gl.TEXTURE_2D_ARRAY, $gl.TEXTURE_WRAP_S, $gl.CLAMP_TO_EDGE);
    $gl.texParameteri($gl.TEXTURE_2D_ARRAY, $gl.TEXTURE_WRAP_T, $gl.CLAMP_TO_EDGE);
    $gl.texParameteri($gl.TEXTURE_2D_ARRAY, $gl.TEXTURE_MIN_FILTER, $gl.LINEAR);
    $gl.texParameteri($gl.TEXTURE_2D_ARRAY, $gl.TEXTURE_MAG_FILTER, $gl.NEAREST);

    $gl.texStorage3D(
        $gl.TEXTURE_2D_ARRAY, 1, $gl.RGBA8,
        textureObject.width, textureObject.height, layers
    );

    $gl.activeTexture($activeTextureUnit !== -1
        ? $activeTextureUnit
        : $gl.TEXTURE0
    );

    return textureObject;
};
