import type { IPath } from "../../interface/IPath";
import { execute as pathCommandMoveToUseCase } from "./PathCommandMoveToUseCase";
import { execute as pathCommandEqualsToLastPointService } from "../service/PathCommandEqualsToLastPointService";
import { execute as pathCommandQuadraticCurveToUseCase } from "./PathCommandQuadraticCurveToUseCase";
import { cubicToQuad } from "../../BezierConverter";

/**
 * @description 3次ベジェ曲線を描画します。
 *              Draw a cubic Bezier curve.
 *
 * @param  {array} current_path 
 * @param  {array} vertices 
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
    current_path: IPath,
    vertices: IPath[],
    cx1: number, cy1: number,
    cx2: number, cy2: number,
    x: number, y: number
): void => {

    if (!current_path.length) {
        pathCommandMoveToUseCase(current_path, vertices, 0, 0);
    }

    if (pathCommandEqualsToLastPointService(current_path, x, y)) {
        return;
    }

    const length = current_path.length;
    const fromX: number = +current_path[length - 3];
    const fromY: number = +current_path[length - 2];

    const buffer = cubicToQuad(fromX, fromY, cx1, cy1, cx2, cy2, x, y);
    for (let idx = 0; 32 > idx; ) {
        pathCommandQuadraticCurveToUseCase(
            current_path,
            vertices,
            buffer[idx++],
            buffer[idx++],
            buffer[idx++],
            buffer[idx++]
        );
    }
};