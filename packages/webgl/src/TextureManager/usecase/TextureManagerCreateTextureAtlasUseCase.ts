import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerCreateTextureObjectService } from "../service/TextureManagerCreateTextureObjectService";
import { execute as textureManagerInitializeBindService } from "../service/TextureManagerInitializeBindService";
import {
    $atlasTextures,
    $atlasNodes,
    $atlasCacheMap,
    $activeTextureUnit
} from "../../TextureManager";
import {
    $gl,
    $upperPowerOfTwo
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

    const textrueObject = textureManagerCreateTextureObjectService(
        $upperPowerOfTwo(width),
        $upperPowerOfTwo(height)
    );

    // update map
    if (!$atlasNodes.has(index)) {
        $atlasNodes.set(index, []);
    }
    if (!$atlasCacheMap.has(index)) {
        $atlasCacheMap.set(index, []);
    }

    // texture initialize setting
    textureManagerInitializeBindService(textrueObject);

    // アトラステクスチャの入れ替え
    if (index in $atlasTextures) {
        const oldTextrueObject = $atlasTextures[index] as NonNullable<ITextureObject>;

        // clone texture

        // delete texture
        $gl.deleteTexture(oldTextrueObject.resource);
    }
    $atlasTextures[index] = textrueObject;
};