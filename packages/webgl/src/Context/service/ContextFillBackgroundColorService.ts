import { $gl } from "../../WebGLUtil";

/**
 * @description 背景色を更新
 *              Update background color
 *
 * @param  {number} red
 * @param  {number} green
 * @param  {number} blue
 * @param  {number} alpha
 * @return {void}
 * @method
 * @protected
 */
export const execute = (red: number, green: number, blue: number, alpha: number): void =>
{
    $gl.clearColor(red, green, blue, alpha);
    $gl.clear($gl.COLOR_BUFFER_BIT | $gl.STENCIL_BUFFER_BIT);
    $gl.clearColor(0, 0, 0, 0);
};