import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectGetRawMatrixUseCase } from "../usecase/DisplayObjectGetRawMatrixUseCase";

/**
 * @description DisplayObjectのy軸方向の拡大率を返却
 *              Returns the scaling factor in the y-axis direction of the DisplayObject
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

    const yScale = Math.round(Math.sqrt(
        matrix[2] * matrix[2]
        + matrix[3] * matrix[3]
    ) * 10000) / 10000;

    return 0 > matrix[3] ? yScale * -1 : yScale;
};