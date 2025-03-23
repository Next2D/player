import type { IPoint } from "../../interface/IPoint";
import { execute as meshSplitQuadraticBezierUseCase } from "./MeshSplitQuadraticBezierUseCase";

/**
 * @description ベジェ曲線を指定回数分割する
 *              Divides a Bezier curve a specified number of times
 *
 * @param {IPoint} start_point
 * @param {IPoint} control_point
 * @param {IPoint} end_point
 * @param {number} [n = 4]
 * @return {Array<IPoint[]>}
 * @method
 * @protected
 */
export const execute = (
    start_point: IPoint,
    control_point: IPoint,
    end_point: IPoint,
    n: number = 4
): Array<IPoint[]> => {

    // 初期リスト：1本だけ
    let segments: Array<IPoint[]> = [[start_point, control_point, end_point]];

    for (let idx = 0; idx < n; ++idx) {
        const newSegments: Array<IPoint[]> = [];
        for (let idx = 0; idx < segments.length; ++idx) {
            const seg = segments[idx];
            if (!seg) {
                continue ;
            }

            // seg = [s0, s1, s2]
            const splitted = meshSplitQuadraticBezierUseCase(seg[0], seg[1], seg[2], 0.5);
            newSegments.push(splitted[0], splitted[1]);
        }
        segments = newSegments;
    }

    // segmentsには 2^n 本の [x,y]が入る
    return segments; // [[p0,p1,p2], [p0,p1,p2], ...]
};