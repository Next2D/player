/**
 * @description Quint easing out function
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
    return (--t * t * t * t * t + 1) * c + b;
};