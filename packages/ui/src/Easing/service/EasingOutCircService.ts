/**
 * @description Easing out circ service
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
    t /= d;
    return Math.sqrt(1 - --t * t) * c + b;
};