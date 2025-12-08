import { execute as pathCommandMoveToUseCase } from "./PathCommandMoveToUseCase";
import { execute as pathCommandEqualsToLastPointService } from "../service/PathCommandEqualsToLastPointService";
import { execute as pathCommandQuadraticCurveToUseCase } from "./PathCommandQuadraticCurveToUseCase";
import { execute as bezierConverterAdaptiveCubicToQuadUseCase } from "../../BezierConverter/usecase/BezierConverterAdaptiveCubicToQuadUseCase";
import { $currentPath } from "../../PathCommand";

/**
 * @description 3次ベジェ曲線を描画します。適応的テッセレーションにより曲率に応じた分割を行います。
 *              Draw a cubic Bezier curve. Uses adaptive tessellation based on curvature.
 *
 * @param  {number} cx1
 * @param  {number} cy1
 * @param  {number} cx2
 * @param  {number} cy2
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    cx1: number, cy1: number,
    cx2: number, cy2: number,
    x: number, y: number
): void => {

    if (!$currentPath.length) {
        pathCommandMoveToUseCase(0, 0);
    }

    if (pathCommandEqualsToLastPointService(x, y)) {
        return;
    }

    const length = $currentPath.length;
    const fromX: number = +$currentPath[length - 3];
    const fromY: number = +$currentPath[length - 2];

    // 適応的テッセレーション: 曲率に基づいて分割数を動的に決定
    // Adaptive tessellation: dynamically determine subdivision count based on curvature
    const result = bezierConverterAdaptiveCubicToQuadUseCase(fromX, fromY, cx1, cy1, cx2, cy2, x, y);
    const buffer = result.buffer;
    const count = result.count;

    for (let idx = 0; idx < count * 4; ) {
        pathCommandQuadraticCurveToUseCase(
            buffer[idx++],
            buffer[idx++],
            buffer[idx++],
            buffer[idx++]
        );
    }
};