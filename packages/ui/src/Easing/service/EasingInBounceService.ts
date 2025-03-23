import { Easing } from "../../Easing";

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
    return c - Easing.outBounce(d - t, 0, c, d) + b;
};