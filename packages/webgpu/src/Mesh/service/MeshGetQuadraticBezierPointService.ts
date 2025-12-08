import type { IPoint } from "../../interface/IPoint";

/**
 * @description 二次ベジエ曲線上の座標を計算する
 *              Calculate the coordinates on the quadratic Bezier curve
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
        "x": (1 - t) ** 2 * start_point.x + 2 * (1 - t) * t * control_point.x + t ** 2 * end_point.x,
        "y": (1 - t) ** 2 * start_point.y + 2 * (1 - t) * t * control_point.y + t ** 2 * end_point.y
    };
};
