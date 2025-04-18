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

    let yScale = Math.sqrt(
        matrix[2] * matrix[2]
        + matrix[3] * matrix[3]
    );

    if (!Number.isInteger(yScale)) {
        const value: string = yScale.toString();
        const index: number = value.indexOf("e");
        if (index !== -1) {
            yScale = +value.slice(0, index);
        }
        yScale = Math.round(yScale * 100) / 100;
    }

    return 0 > matrix[0] ? yScale * -1 : yScale;
};