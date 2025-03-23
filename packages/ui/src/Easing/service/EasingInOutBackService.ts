/**
 * @description Easing in out back service
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
    let s = 1.70158;
    return (t /= d / 2) < 1
        ? t * t * (((s *= 1.525) + 1) * t - s) * c / 2 + b
        : ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) * c / 2 + b;
};