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

    const EPS = 1e-12;
    const signX  = (Math.abs(matrix[0]) >= EPS ? Math.sign(matrix[0]) : Math.sign(matrix[1])) || 1;
    const xScale = Math.hypot(matrix[0], matrix[1]);

    return Math.round(xScale * signX * 10000) / 10000;
};