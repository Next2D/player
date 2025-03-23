
import { $gl } from "../../WebGLUtil";

/**
 * @description 描画範囲を設定
 *              Set the drawing range.
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
    // 初期化範囲を設定
    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(x, y, w + 1, h + 1);

    // 初期化
    $gl.clear($gl.COLOR_BUFFER_BIT | $gl.STENCIL_BUFFER_BIT);

    // 描画領域をあらためて設定
    $gl.scissor(x, y, w, h);
};