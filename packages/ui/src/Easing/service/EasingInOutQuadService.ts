/**
 * @description Quad easing in/out function
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
        ? t * t * c / 2 + b
        : -((t -= 1) * (t - 2) - 1) * c / 2 + b;
};