import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectGetRawMatrixUseCase } from "../usecase/DisplayObjectGetRawMatrixUseCase";

/**
 * @description DisplayObjectのx軸方向の拡大率を返却
 *              Returns the scaling factor in the x-axis direction of the DisplayObject
 *
 * @param  {DisplayObject} display_object
 * @return {number}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): number =>
{
    const matrix = display_object.$matrix
        ? display_object.$matrix.rawData
        : displayObjectGetRawMatrixUseCase(display_object);

    if (!matrix) {
        return 1;
    }

    const xScale = Math.round(Math.sqrt(
        matrix[0] * matrix[0]
        + matrix[1] * matrix[1]
    ) * 10000) / 10000;

    return 0 > matrix[0] ? xScale * -1 : xScale;
};