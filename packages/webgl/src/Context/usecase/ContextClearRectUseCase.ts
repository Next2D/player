import { $context, $gl } from "../../WebGLUtil";
import { execute as maskClearRectService } from "../../Mask/service/MaskClearRectService";

/**
 * @description 指定範囲をクリアする
 *              Clear the specified range
 * 
 * @param  {number} x
 * @param  {number} y
 * @param  {number} w
 * @param  {number} h
 * @return {void}
 * @method
 * @protected
 */
export const execute = (x: number, y: number, w: number, h: number): void =>
{
    // mask clear
    // maskClearRectService();

    // 指定範囲をクリア
    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(x, y, w, h);
    $gl.clear($gl.COLOR_BUFFER_BIT | $gl.STENCIL_BUFFER_BIT);
    $gl.disable($gl.SCISSOR_TEST);
};