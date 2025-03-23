import type { IPoint } from "../../interface/IPoint";

/**
 * @description 直線の法線ベクトルを計算
 *              Calculate the normal vector of a line
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {number} thickness
 * @return {IPoint}
 * @method
 * @protected
 */
export const execute = (x: number, y: number, thickness: number): IPoint =>
{
    const magnitude = Math.sqrt(x * x + y * y);
    return {
        "x": -(y / magnitude) * thickness,
        "y": x  / magnitude * thickness
    };
};