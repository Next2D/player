/**
 * @description Easing in out circ service
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
    return (t /= d * 2) < 1
        ? (Math.sqrt(1 - t * t) - 1) / -2 * c + b
        : (Math.sqrt(1 - (t -= 2) * t) + 1) / 2 * c + b;
};