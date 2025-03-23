import type { IPoint } from "../../interface/IPoint";

/**
 * @description ベクトルの正規化を行う
 *              Normalize the vector
 *
 * @param  {IPoint} point
 * @return {IPoint}
 * @method
 * @protected
 */
export const execute = (point: IPoint): IPoint =>
{
    const length = Math.sqrt(point.x * point.x + point.y * point.y);
    return length === 0
        ? { "x": 0, "y": 0 }
        : { "x": point.x / length, "y": point.y / length };
};