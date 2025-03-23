import { Easing } from "../../Easing";

/**
 * @description Easing in out bounce function
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
    return t < d / 2
        ? Easing.inBounce(t * 2, b, c / 2, d)
        : Easing.outBounce(t * 2 - d, b + c / 2, c / 2, d);
};