import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectGetRawMatrixUseCase } from "../usecase/DisplayObjectGetRawMatrixUseCase";

/**
 * @description ラジアンから度に変換するための定数
 *              Constant for converting radians to degrees
 * 
 * @type {number}
 */
const $Rad2Deg: number = 180 / Math.PI;

/**
 * @description DisplayObjectの回転角度を返却
 *              Returns the rotation angle of the DisplayObject
 * 
 * @param  {DisplayObject} display_object 
 * @return {number}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): number =>
{
    if (display_object.$rotation !== null) {
        return display_object.$rotation;
    }

    const matrix = display_object.$matrix
        ? display_object.$matrix.rawData
        : displayObjectGetRawMatrixUseCase(display_object);

    return matrix ? Math.atan2(matrix[1], matrix[0]) * $Rad2Deg : 0;
};