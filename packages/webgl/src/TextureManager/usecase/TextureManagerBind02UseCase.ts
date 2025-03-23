import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerBindService } from "../service/TextureManagerBindService";
import { $gl } from "../../WebGLUtil";

/**
 * @description TEXTURE0とTEXTURE2にテクスチャをバインドします。
 *              Binds textures to TEXTURE0 and TEXTURE2.
 *
 * @param  {ITextureObject} texture0
 * @param  {ITextureObject} texture2
 * @param  {boolean} [smooth=false]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    texture0: ITextureObject,
    texture2: ITextureObject,
    smooth: boolean = false
): void => {
    textureManagerBindService(2, $gl.TEXTURE2, texture2, smooth);
    textureManagerBindService(1, $gl.TEXTURE1, null);
    textureManagerBindService(0, $gl.TEXTURE0, texture0, smooth);
};