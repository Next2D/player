import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectGetRawBoundsUseCase } from "./DisplayObjectGetRawBoundsUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../service/DisplayObjectCalcBoundsMatrixService";
import { Rectangle, Matrix } from "@next2d/geom";
import { $poolBoundsArray } from "../../DisplayObjectUtil";

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
    $poolBoundsArray(rawBounds);
    Matrix.release(matrix.rawData);

    if (!target_display_object) {
        const rectangle = new Rectangle(
            bounds[0], bounds[1],
            Math.abs(bounds[2] - bounds[0]),
            Math.abs(bounds[3] - bounds[1])
        );

        $poolBoundsArray(bounds);
        return rectangle;
    }

    const targetMatrix: Matrix = target_display_object.concatenatedMatrix;
    targetMatrix.invert();

    const targetBounds = displayObjectCalcBoundsMatrixService(
        bounds[0], bounds[1],
        bounds[2], bounds[3],
        targetMatrix.rawData
    );

    // pool
    $poolBoundsArray(bounds);
    Matrix.release(targetMatrix.rawData);

    const rectangle = new Rectangle(
        targetBounds[0], targetBounds[1],
        Math.abs(targetBounds[2] - targetBounds[0]),
        Math.abs(targetBounds[3] - targetBounds[1])
    );

    $poolBoundsArray(targetBounds);

    return rectangle;
};