/**
 * @description Easing out sine function
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
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
};