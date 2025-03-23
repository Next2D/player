import { Point } from "../../Point";

/**
 * @description 指定された長さと角度からポイントを返します。
 *              Returns a point from the specified length and angle.
 *
 * @param  {number} length
 * @param  {number} angle
 * @return {Point}
 * @method
 * @public
 */
export const execute = (length: number, angle: number): Point =>
{
    return new Point(length * Math.cos(angle), length * Math.sin(angle));
};