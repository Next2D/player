/**
 * @description Easing out expo function
 *
 * @param  {number} t
 * @param  {number} b
 * @param  {number} c
 * @param  {number} d
 * @return {number}
 * @method
 * @public
 */
export const execute = (t: number, b: number, c: number, d: number): number =>
{
    return c * (-Math.pow(2, -10 * t / d) + 1) + b;
};