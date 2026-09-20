import type { ITextureObject } from "/packages/webgl/src/interface/ITextureObject";
import { execute as textureManagerBindService } from "/packages/webgl/src/TextureManager/service/TextureManagerBindService";
import { $gl } from "/packages/webgl/src/WebGLUtil";
import { $boundTextures } from "/packages/webgl/src/TextureManager";

/**
 * @description TEXTURE0とTEXTURE1にテクスチャをバインドします。
 *              Binds textures to TEXTURE0 and TEXTURE1.
 *
 * @param  {ITextureObject} texture0
 * @param  {ITextureObject} texture1
 * @param  {boolean} [smooth=false]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    texture0: ITextureObject,
    texture1: ITextureObject,
    smooth: boolean = false
): void => {
    if ($boundTextures[2] !== null) {
        textureManagerBindService(2, $gl.TEXTURE2, null, smooth);
    }
    textureManagerBindService(1, $gl.TEXTURE1, texture1, smooth);
    textureManagerBindService(0, $gl.TEXTURE0, texture0, smooth);
};
