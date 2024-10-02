import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerBindService } from "../service/TextureManagerBindService";
import { $gl } from "../../WebGLUtil";

/**
 * @description TEXTURE0とTEXTURE1にテクスチャをバインドします。
 *              Binds textures to TEXTURE0 and TEXTURE1.
 *
 * @param  {ITextureObject} texture0
 * @return {void}
 * @method
 * @protected
 */
export const execute = (texture0: ITextureObject, texture1: ITextureObject): void =>
{
    textureManagerBindService(2, $gl.TEXTURE2, null);
    textureManagerBindService(1, $gl.TEXTURE1, texture1);
    textureManagerBindService(0, $gl.TEXTURE0, texture0);
};