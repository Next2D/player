import type { IPoint } from "../../interface/IPoint";

/**
 * @description 線形補間
 *              Linear interpolation
 *
 * @param  {IPoint} pointA
 * @param  {IPoint} pointB
 * @param  {number} t
 * @return {IPoint}
 * @method
 * @protected
 */
export const execute = (
    pointA: IPoint,
    pointB: IPoint,
    t: number
): IPoint => {
    return {
        "x": pointA.x + (pointB.x - pointA.x) * t,
        "y": pointA.y + (pointB.y - pointA.y) * t
    };
};
