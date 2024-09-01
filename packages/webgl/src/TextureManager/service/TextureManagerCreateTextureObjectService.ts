import type { ITextureObject } from "../../interface/ITextureObject";
import { $gl } from "../../WebGLUtil";

/**
 * @type {number}
 * @private
 */
let $id: number = 0;

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
        "id": $id++,
        "resource": $gl.createTexture() as NonNullable<WebGLTexture>,
        "width": width,
        "height": height,
        "area": width * height
    };
};