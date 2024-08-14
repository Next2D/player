import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { $gl } from "../../WebGLUtil";

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
        "resource": $gl.createRenderbuffer() as NonNullable<WebGLRenderbuffer>,
        "width": 0,
        "height": 0,
        "area": 0,
        "dirty": false
    };
}