import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectGetRawBoundsUseCase } from "./DisplayObjectGetRawBoundsUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../service/DisplayObjectCalcBoundsMatrixService";
import { Matrix } from "@next2d/geom";
import { $poolArray } from "../../DisplayObjectUtil";

/**
 * @description
 * @param  {DisplayObject} display_object
 * @param  {DisplayObject} target_display_object
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(
    display_object: D,
    target_display_object: D
): boolean => {

    const rawBounds1 = displayObjectGetRawBoundsUseCase(display_object);
    const matrix1 = display_object.concatenatedMatrix;
    const bounds1 = displayObjectCalcBoundsMatrixService(
        rawBounds1[0], rawBounds1[1],
        rawBounds1[2], rawBounds1[3],
        matrix1.rawData
    );

    // pool
    $poolArray(rawBounds1);
    Matrix.release(matrix1.rawData);

    const rawBounds2 = displayObjectGetRawBoundsUseCase(target_display_object);
    const matrix2 = target_display_object.concatenatedMatrix;
    const bounds2 = displayObjectCalcBoundsMatrixService(
        rawBounds2[0], rawBounds2[1],
        rawBounds2[2], rawBounds2[3],
        matrix2.rawData
    );

    // pool
    $poolArray(rawBounds2);
    Matrix.release(matrix2.rawData);

    // calc
    const sx = Math.max(bounds1[0], bounds2[0]);
    const sy = Math.max(bounds1[1], bounds2[1]);
    const ex = Math.min(bounds1[2], bounds2[2]);
    const ey = Math.min(bounds1[3], bounds2[3]);

    // pool
    $poolArray(bounds1);
    $poolArray(bounds2);

    return ex - sx >= 0 && ey - sy >= 0;
};