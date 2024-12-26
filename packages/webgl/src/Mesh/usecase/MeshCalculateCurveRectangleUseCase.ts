import type { IPath } from "../../interface/IPath";
import type { IPoint } from "../../interface/IPoint";
import { execute as meshSplitBezierMultipleTimesUseCase } from "./MeshSplitBezierMultipleTimesUseCase";
import { execute as meshApproximateOffsetQuadraticUseCase } from "./MeshApproximateOffsetQuadraticUseCase";

/**
 * @description カーブの矩形を計算する
 *              Calculate curve rectangle
 *
 * @param  {IPoint} start_point
 * @param  {IPoint} control_point
 * @param  {IPoint} end_point
 * @param  {number} thickness
 * @return {IPath}
 * @memthod
 * @protected
 */
export const execute = (
    start_point: IPoint,
    control_point: IPoint,
    end_point: IPoint,
    thickness: number
): IPath => {

    const segments = meshSplitBezierMultipleTimesUseCase(
        start_point,
        control_point,
        end_point,
        5
    );

    // "左右" にオフセットした2次ベジエを作る
    // { leftCurves: [...], rightCurves: [...] } の形で保持する
    // leftCurves[i] = [Q0, Q1, Q2] (2次ベジエの3点)
    // rightCurves[i] = [Q0, Q1, Q2]
    const leftCurves: Array<IPoint[]>  = [];
    const rightCurves: Array<IPoint[]> = [];
    for (let idx = 0; idx < segments.length; ++idx) {

        const [s0, s1, s2] = segments[idx];

        // +offset と -offset を作成
        leftCurves.push(meshApproximateOffsetQuadraticUseCase(s0, s1, s2, +thickness));
        rightCurves.push(meshApproximateOffsetQuadraticUseCase(s0, s1, s2, -thickness));
    }

    // 左サイドの最初のサブカーブ始点
    const leftStart = leftCurves[0][0];
    const paths: IPath = [leftStart.x, leftStart.y, false];

    // 左サイドの最終サブカーブ終了点 → 右サイドの最終サブカーブ終了点へ移動
    for (let idx = 0; idx < leftCurves.length; ++idx) {
        const curves = leftCurves[idx];
        paths.push(
            curves[1].x, curves[1].y, true,
            curves[2].x, curves[2].y, false
        );
    }

    const reversedRight = [...rightCurves].reverse();
    for (let idx = 0; idx < reversedRight.length; ++idx) {
        const [q0, q1, q2] = reversedRight[idx];
        reversedRight[idx] = [q2, q1, q0]; // [Q2, Q1, Q0]
    }

    // 右サイドの最初のサブカーブ始点
    const rightEnd = reversedRight[0][0];
    paths.push(rightEnd.x, rightEnd.y, false);

    // 右サイドの最終サブカーブ終了点 → 左サイドの最終サブカーブ終了点へ移動
    for (let idx = 0; idx < reversedRight.length; ++idx) {
        const curves = reversedRight[idx];
        paths.push(
            curves[1].x, curves[1].y, true,
            curves[2].x, curves[2].y, false
        );
    }

    return paths;
};