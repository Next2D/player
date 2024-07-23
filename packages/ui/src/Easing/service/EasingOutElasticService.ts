/**
 * @description Easing out elastic service
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
            : (Math.pow(2, -10 * t)
                * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1)
                    * c + b;
};