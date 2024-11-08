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
    if (display_object.$scaleX !== null) {
        return display_object.$scaleX;
    }

    const matrix = display_object.$matrix
        ? display_object.$matrix.rawData
        : displayObjectGetRawMatrixUseCase(display_object);

    if (!matrix) {
        return 1;
    }

    let xScale: number = Math.sqrt(
        matrix[0] * matrix[0]
        + matrix[1] * matrix[1]
    );

    if (!Number.isInteger(xScale)) {
        const value: string = xScale.toString();
        const index: number = value.indexOf("e");
        if (index !== -1) {
            xScale = +value.slice(0, index);
        }
        xScale = +xScale.toFixed(4);
    }

    return 0 > matrix[0] ? xScale * -1 : xScale;
};