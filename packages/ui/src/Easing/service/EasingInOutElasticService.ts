/**
 * @description Easing in out elastic service
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
    return (t /= d) === 0
        ? b
        : t === 1
            ? c + b
            : t < 0.5
                ? -(Math.pow(2, 20  * t - 10) * Math.sin((20 * t - 11.125) * (2 * Math.PI / 4.5))) / 2    * c + b
                : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * (2 * Math.PI / 4.5)) / 2 + 1) * c + b;
};