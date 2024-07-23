/**
 * @description Easing out bounce function
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
    if ((t /= d) < 1 / 2.75) {
        return 7.5625 * t * t * c + b;
    }
    if (t < 2 / 2.75) {
        return (7.5625 * (t -= 1.5 / 2.75)   * t + 0.75) * c + b;
    }
    if (t < 2.5 / 2.75) {
        return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) * c + b;
    }
    return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) * c + b;
};