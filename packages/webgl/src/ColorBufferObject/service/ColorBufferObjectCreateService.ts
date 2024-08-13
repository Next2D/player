import type { IColorBufferObject } from "../../interface/IColorBufferObject";
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
    return {
        "colorRenderbuffer": $gl.createRenderbuffer() as NonNullable<WebGLRenderbuffer>,
        "stencilRenderbuffer": $gl.createRenderbuffer() as NonNullable<WebGLRenderbuffer>,
        "width": 0,
        "height": 0,
        "area": 0
    };
}