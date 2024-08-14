import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerCreateTextureObjectService } from "../service/TextureManagerCreateTextureObjectService";
import {
    $atlasTextures,
    $atlasNodes,
    $atlasCacheMap
} from "../../TextureManager";
import {
    $gl,
    $RENDER_SIZE
} from "../../WebGLUtil";

/**
 * @description 新規のテクスチャアトラスを作成します。
 *              Create a new texture atlas.
 * 
 * @param  {number} [width=256]
 * @param  {number} [height=256]
 * @param  {number} [index=0]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    width: number = 256,
    height: number = 256,
    index: number = 0
): void => {

    const textrueObject = textureManagerCreateTextureObjectService(width, height);
    if (index in $atlasTextures) {
        const oldTextrueObject = $atlasTextures[index] as NonNullable<ITextureObject>;

        // clone texture

        // delete texture
        $gl.deleteTexture(oldTextrueObject.resource);
        oldTextrueObject.resource = null;
    }
    $atlasTextures[index] = textrueObject;

    // update map
    if (!$atlasNodes.has(index)) {
        $atlasNodes.set(index, []);
    }
    if (!$atlasCacheMap.has(index)) {
        $atlasCacheMap.set(index, []);
    }

    $gl.activeTexture($gl.TEXTURE3 + index);
    $gl.bindTexture($gl.TEXTURE_2D, textrueObject.resource);

    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_S, $gl.CLAMP_TO_EDGE);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_WRAP_T, $gl.CLAMP_TO_EDGE);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MIN_FILTER, $gl.NEAREST);
    $gl.texParameteri($gl.TEXTURE_2D, $gl.TEXTURE_MAG_FILTER, $gl.NEAREST);

    $gl.texStorage2D($gl.TEXTURE_2D, 1, $gl.RGBA8, width, height);

    // reset
    $gl.bindTexture($gl.TEXTURE_2D, null);    
};