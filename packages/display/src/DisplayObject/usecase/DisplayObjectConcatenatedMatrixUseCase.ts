import type { DisplayObject } from "../../DisplayObject";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectGetRawMatrixUseCase } from "../usecase/DisplayObjectGetRawMatrixUseCase";
import { $MATRIX_ARRAY_IDENTITY } from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectの連結Matrixを返却
 *              Returns the concatenated Matrix of the DisplayObject.
 * 
 * @param  {DisplayObject} display_object 
 * @return {Matrix}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): Matrix =>
{
    const rawMatrix = displayObjectGetRawMatrixUseCase(display_object);

    let matrix = rawMatrix ? rawMatrix : $MATRIX_ARRAY_IDENTITY;
    let parent = display_object.parent;
    while (parent) {

        const rawMatrix = displayObjectGetRawMatrixUseCase(parent);
        if (rawMatrix) {
            matrix = Matrix.multiply(rawMatrix, matrix);
        }

        parent = parent.parent;
    }

    return new Matrix(
        matrix[0], matrix[1], matrix[2],
        matrix[3], matrix[4], matrix[5]
    );
};