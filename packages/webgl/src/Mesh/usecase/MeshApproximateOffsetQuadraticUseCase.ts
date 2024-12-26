import type { IPoint } from "../../interface/IPoint";
import { execute as meshGetQuadraticBezierPointService } from "../service/MeshGetQuadraticBezierPointService";
import { execute as meshGetQuadraticBezierTangentService } from "../service/MeshGetQuadraticBezierTangentService";
import { execute as meshCalculateNormalizeBezierService } from "../service/MeshCalculateNormalizeBezierService";

/**
 * @description 2次ベジエのオフセットを計算する
 *              Calculate the offset of the quadratic Bezier
 *
 * @param  {IPoint} s0
 * @param  {IPoint} s1
 * @param  {IPoint} s2
 * @param  {number} offset
 * @return {IPoint[]}
 * @method
 * @protected
 */
export const execute = (
    s0: IPoint,
    s1: IPoint,
    s2: IPoint,
    offset: number
): IPoint[] => {

    const tValues = [0, 0.5, 1];
    const newPoints: IPoint[] = [];

    for (let idx = 0; idx < tValues.length; ++idx) {

        const t = tValues[idx];
        const pos = meshGetQuadraticBezierPointService(t, s0, s1, s2);
        const tan = meshGetQuadraticBezierTangentService(t, s0, s1, s2);

        // 左方向の法線 = (-dy, dx)
        const n = meshCalculateNormalizeBezierService({
            "x": -tan.y,
            "y": tan.x
        });

        newPoints.push({
            "x": pos.x + n.x * offset,
            "y": pos.y + n.y * offset
        });
    }

    // [Q0, Q1, Q2]
    return newPoints;
};