import type { Graphics } from "../../Graphics";

/**
 * @description 塗りの描画範囲を計算
 *              Calculate the fill drawing range
 *
 * @param  {Graphics} graphics
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @protected
 */
export const execute = (graphics: Graphics, x: number = 0, y: number = 0): void =>
{
    // 経路の点ごとに呼ばれるので、Math.min / Math.max の呼び出しを避けて比較で広げる
    if (x < graphics.xMin) {
        graphics.xMin = x;
    }
    if (x > graphics.xMax) {
        graphics.xMax = x;
    }
    if (y < graphics.yMin) {
        graphics.yMin = y;
    }
    if (y > graphics.yMax) {
        graphics.yMax = y;
    }
};