import type { ITextureObject } from "/packages/webgl/src/interface/ITextureObject";
import { execute as textureManagerBindService } from "/packages/webgl/src/TextureManager/service/TextureManagerBindService";
import { $gl } from "/packages/webgl/src/WebGLUtil";
import { $boundTextures } from "/packages/webgl/src/TextureManager";

/**
 * @description テクスチャをTEXTURE0にバインドし、TEXTURE1、TEXTURE2をアンバインドします。
 *              Bind the texture to TEXTURE0 and unbind TEXTURE1 and TEXTURE2.
 *
 * @param  {ITextureObject} texture0
 * @param  {boolean} [smooth=false]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (texture0: ITextureObject, smooth: boolean = false): void =>
{
    if ($boundTextures[2] !== null) {
        textureManagerBindService(2, $gl.TEXTURE2, null);
    }
    if ($boundTextures[1] !== null) {
        textureManagerBindService(1, $gl.TEXTURE1, null);
    }
    textureManagerBindService(0, $gl.TEXTURE0, texture0, smooth);
};
