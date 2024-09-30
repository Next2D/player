/**
 * @description 2Dベクトルの外積を計算
 *              Calculate the cross product of 2D vectors
 *
 * @param  {number} x1
 * @param  {number} y1
 * @param  {number} x2
 * @param  {number} y2
 * @return {number}
 * @method
 * @protected
 */
export const execute = (x1: number, y1: number, x2: number, y2: number): number =>
{
    return x1 * y2 - x2 * y1;
};