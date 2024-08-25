import type { DisplayObject } from "../../DisplayObject";
import type { Shape } from "../../Shape";
import { Matrix } from "@next2d/geom";
import { execute as shapeGetCalcBoundsMatrixUseCase } from "../../Shape/usecase/ShapeGetCalcBoundsMatrixUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import {
    $getArray,
    $poolArray
} from "@next2d/share";

/**
 * @description DisplayObjectのマスク描画範囲を計算して、マスク描画が実行可能かどうかを返します。
 *              Calculate the mask drawing area of DisplayObject and return whether the mask drawing is executable.
 * 
 * @param  {DisplayObject} display_object 
 * @param  {Float32Array} matrix 
 * @param  {number} renderer_width 
 * @param  {number} renderer_height 
 * @param  {number} point_x 
 * @param  {number} point_y 
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(
    display_object: D,
    matrix: Float32Array,
    renderer_width: number,
    renderer_height: number,
    point_x: number,
    point_y: number
): number[] | null => {

    let bounds: number[] | null = null;

    const rawMatrix = displayObjectGetRawMatrixUseCase(display_object);
    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    switch (true) {

        case display_object.isShape:
            bounds = shapeGetCalcBoundsMatrixUseCase(
                (display_object as unknown as Shape).graphics, tMatrix
            );
            break;
        
        case display_object.isContainerEnabled:
            // todo
            break;

        case display_object.isText:
            // todo
            break;

        case display_object.isVideo:
            // todo
            break;

        default:
            break;

    }

    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }

    if (!bounds) {
        return null;
    }

    const xMin = bounds[0];
    const xMax = bounds[2];
    const width = Math.abs(xMax - xMin);
    if (!width) {
        return null;
    }

    const yMin = bounds[1];
    const yMax = bounds[3];
    const height = Math.abs(yMax - yMin);
    if (!height) {
        return null;
    }

    if (point_x > xMin + width 
        || point_y > yMin + height
        || xMin > renderer_width 
        || yMin > renderer_height
    ) {
        return null;
    }

    return bounds;
};