import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerBindService } from "../service/TextureManagerBindService";
import { $gl } from "../../WebGLUtil";

/**
 * @description テクスチャをTEXTURE0にバインドし、TEXTURE1、TEXTURE2をアンバインドします。
 *              Bind the texture to TEXTURE0 and unbind TEXTURE1 and TEXTURE2.
 * 
 * @param  {ITextureObject} texture0
 * @param  {boolean} smoothing0
 * @return {void}
 * @method
 * @protected
 */
export const execute = (texture0: ITextureObject, smoothing0: boolean | null = null): void =>
{
    textureManagerBindService(2, $gl.TEXTURE2, null, null);
    textureManagerBindService(1, $gl.TEXTURE1, null, null);
    textureManagerBindService(0, $gl.TEXTURE0, texture0, smoothing0);
};