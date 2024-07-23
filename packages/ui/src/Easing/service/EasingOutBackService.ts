/**
 * @description Easing out back service
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
    return (1 + 2.70158
        * Math.pow((t /= d) - 1, 3) + 1.70158
        * Math.pow(t - 1, 2)
    ) * c + b;
};