import type { ITextureObject } from "../../interface/ITextureObject";
import { $gl } from "../../WebGLUtil";

/**
 * @description 新規のテクスチャオブジェクトを作成します。
 *              Create a new texture object.
 * 
 * @param  {number} width 
 * @param  {number} height 
 * @param  {boolean} [smoothing=false] 
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    width: number,
    height: number,
    smoothing: boolean = false
): ITextureObject => {
    return {
        "resource": $gl.createTexture() as NonNullable<WebGLTexture>,
        "width": width,
        "height": height,
        "area": width * height,
        "smoothing": smoothing,
        "dirty": false
    };
};