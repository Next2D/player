import type { Context } from "../../Context";
import { $clamp } from "../../WebGLUtil";

/**
 * @description 背景色を設定を更新
 *              Update background color setting
 * 
 * @param  {Context} context
 * @param  {number} red 
 * @param  {number} green 
 * @param  {number} blue 
 * @param  {number} alpha 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    context: Context,
    red: number,
    green: number,
    blue: number, 
    alpha: number
): void => {
    context.$clearColorR = $clamp(red, 0, 1, 0);
    context.$clearColorG = $clamp(green, 0, 1, 0);
    context.$clearColorB = $clamp(blue, 0, 1, 0);
    context.$clearColorA = $clamp(alpha, 0, 1, 0);
};