import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectGetRawBoundsUseCase } from "./DisplayObjectGetRawBoundsUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../service/DisplayObjectCalcBoundsMatrixService";
import { Rectangle, Matrix } from "@next2d/geom";
import { $poolArray } from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectのmatrixを考慮した描画範囲を計算
 *              Calculate the drawing range considering the matrix of DisplayObject
 *
 * @param  {DisplayObject} display_object
 * @param  {DisplayObject} [target_display_object=null]
 * @return {Rectangle}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(
    display_object: D,
    target_display_object: D | null = null
): Rectangle => {

    const matrix = display_object.concatenatedMatrix;
    const rawBounds = displayObjectGetRawBoundsUseCase(display_object);

    // to global
    const bounds = displayObjectCalcBoundsMatrixService(
        rawBounds[0], rawBounds[1],
        rawBounds[2], rawBounds[3],
        matrix.rawData
    );

    // pool
    $poolArray(rawBounds);
    Matrix.release(matrix.rawData);

    if (!target_display_object) {
        target_display_object = display_object;
    }

    const targetMatrix: Matrix = target_display_object.concatenatedMatrix;
    targetMatrix.invert();

    const targetBounds = displayObjectCalcBoundsMatrixService(
        bounds[0], bounds[1],
        bounds[2], bounds[3],
        targetMatrix.rawData
    );

    // pool
    $poolArray(bounds);
    Matrix.release(targetMatrix.rawData);

    const rectangle = new Rectangle(
        targetBounds[0], targetBounds[1],
        Math.abs(targetBounds[2] - targetBounds[0]),
        Math.abs(targetBounds[3] - targetBounds[1])
    );

    $poolArray(targetBounds);

    return rectangle;
};