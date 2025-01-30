import type { DisplayObject } from "../../DisplayObject";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectGetRawMatrixUseCase } from "./DisplayObjectGetRawMatrixUseCase";

/**
 * @description DisplayObject の Matrix を取得します。
 *              Get the Matrix of DisplayObject.
 *
 * @param  {D} display_object
 * @return {Matrix}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (display_object: D): Matrix =>
{
    const matrix = displayObjectGetRawMatrixUseCase(display_object);
    return matrix
        ? new Matrix(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5])
        : new Matrix();
};