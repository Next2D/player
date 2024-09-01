import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { $gl } from "../../WebGLUtil";

/**
 * @type {number}
 * @private
 */
let $id: number = 0;

/**
 * @description 新規のStencilBufferObjectを生成する
 *              Create a new StencilBufferObject
 *
 * @return {object}
 * @method
 * @protected
 */
export const execute = (): IStencilBufferObject =>
{
    return {
        "id": $id++,
        "resource": $gl.createRenderbuffer() as NonNullable<WebGLRenderbuffer>,
        "width": 0,
        "height": 0,
        "area": 0,
        "dirty": false
    };
}