import type { IPoint } from "../../interface/IPoint";

/**
 * @description 二次ベジエ曲線上の接線ベクトルを計算する
 *              Calculate the tangent vector on the quadratic Bezier curve
 *
 * @param  {number} t
 * @param  {IPoint} start_point
 * @param  {IPoint} control_point
 * @param  {IPoint} end_point
 * @return {IPoint}
 * @method
 * @protected
 */
export const execute = (
    t: number,
    start_point: IPoint,
    control_point: IPoint,
    end_point: IPoint
): IPoint => {
    return {
        "x": 2 * (1 - t) * (control_point.x - start_point.x) + 2 * t * (end_point.x - control_point.x),
        "y": 2 * (1 - t) * (control_point.y - start_point.y) + 2 * t * (end_point.y - control_point.y)
    };
};