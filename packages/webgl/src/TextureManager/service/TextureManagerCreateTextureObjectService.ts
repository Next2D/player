import type { ITextureObject } from "../../interface/ITextureObject";
import { $gl } from "../../WebGLUtil";

/**
 * @description 新規のテクスチャオブジェクトを作成します。
 *              Create a new texture object.
 * 
 * @param  {number} width 
 * @param  {number} height 
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (width: number, height: number): ITextureObject =>
{
    return {
        "resource": $gl.createTexture() as NonNullable<WebGLTexture>,
        "width": width,
        "height": height,
        "area": width * height
    };
};