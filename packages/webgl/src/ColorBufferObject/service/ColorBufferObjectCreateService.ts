import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { $gl } from "../../WebGLUtil";

/**
 * @description 新規のColorBufferObjectを生成する
 *              Create a new ColorBufferObject
 *
 * @return {object}
 * @method
 * @protected
 */
export const execute = (): IColorBufferObject =>
{
    const stencilBufferObject: IStencilBufferObject = {
        "resource": $gl.createRenderbuffer() as NonNullable<WebGLRenderbuffer>,
        "width": 0,
        "height": 0,
        "area": 0,
        "dirty": false
    };

    return {
        "resource": $gl.createRenderbuffer() as NonNullable<WebGLRenderbuffer>,
        "stencil": stencilBufferObject,
        "width": 0,
        "height": 0,
        "area": 0,
        "dirty": false
    };
}