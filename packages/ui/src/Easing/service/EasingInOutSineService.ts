/**
 * @description Easing in out sine function
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
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};