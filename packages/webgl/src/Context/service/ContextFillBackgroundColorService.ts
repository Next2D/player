import { $gl } from "../../WebGLUtil";
import {
    $readFrameBuffer,
    $drawFrameBuffer
} from "../../FrameBufferManager";

/**
 * @type {number[]}
 * @private
 */
const $colors: number[] = [0, 0, 0, 0];

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
    $colors[0] = red;
    $colors[1] = green;
    $colors[2] = blue;
    $colors[3] = alpha;

    $gl.bindFramebuffer($gl.DRAW_FRAMEBUFFER, $readFrameBuffer);
    $gl.clearBufferfv($gl.COLOR, 0, $colors);
    $gl.bindFramebuffer($gl.DRAW_FRAMEBUFFER, $drawFrameBuffer);
};