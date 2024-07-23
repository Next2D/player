/**
 * @description Easing in out expo function
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
    return (t /= d / 2) < 1
        ? c / 2 * Math.pow(2, 10 * (t - 1)) + b
        : c / 2 * (-Math.pow(2, -10 * (t - 1)) + 2) + b;
};