import type { IPoint } from "../../interface/IPoint";
import { execute as meshLerpService } from "../service/MeshLerpService";

/**
 * @description 二次ベジェ曲線を分割する
 *              Split a quadratic Bezier curve
 *
 * @param  {IPoint} start_point
 * @param  {IPoint} control_point
 * @param  {IPoint} end_point
 * @param  {number} [t = 0.5]
 * @return {Array<IPoint[]>}
 * @method
 * @protected
 */
export const execute = (
    start_point: IPoint,
    control_point: IPoint,
    end_point: IPoint,
    t: number = 0.5
): Array<IPoint[]> => {

    // 二次ベジエ曲線の分割
    // M0  = lerp(P0, P1, t)
    // M1  = lerp(P1, P2, t)
    // M01 = lerp(M0, M1, t)
    const M0  = meshLerpService(start_point, control_point, t);
    const M1  = meshLerpService(control_point, end_point, t);
    const M01 = meshLerpService(M0, M1, t);

    // 左サブ (0...t): [P0,  M0, M01]
    // 右サブ (t...1): [M01, M1, P2]
    return [
        [start_point, M0, M01],
        [M01, M1, end_point]
    ];
};