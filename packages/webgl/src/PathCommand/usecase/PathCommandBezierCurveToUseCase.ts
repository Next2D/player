import { execute as pathCommandMoveToUseCase } from "./PathCommandMoveToUseCase";
import { execute as pathCommandEqualsToLastPointService } from "../service/PathCommandEqualsToLastPointService";
import { execute as pathCommandQuadraticCurveToUseCase } from "./PathCommandQuadraticCurveToUseCase";
import { execute as bezierConverterCubicToQuadUseCase } from "../../BezierConverter/usecase/BezierConverterCubicToQuadUseCase";
import { $currentPath } from "../../PathCommand";

/**
 * @description 3次ベジェ曲線を描画します。
 *              Draw a cubic Bezier curve.
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

    const buffer = bezierConverterCubicToQuadUseCase(fromX, fromY, cx1, cy1, cx2, cy2, x, y);
    for (let idx = 0; 32 > idx; ) {
        pathCommandQuadraticCurveToUseCase(
            buffer[idx++],
            buffer[idx++],
            buffer[idx++],
            buffer[idx++]
        );
    }
};