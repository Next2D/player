/**
 * @description Easing in back service
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
    return (2.70158 * (t /= d) * t * t - 1.70158 * t * t) * c + b;
};