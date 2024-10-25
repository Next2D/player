import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectGetRawMatrixUseCase } from "../usecase/DisplayObjectGetRawMatrixUseCase";

/**
 * @description DisplayObjectのx座標を返却
 *              Return x-coordinate of DisplayObject
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
    return matrix ? matrix[4] : 0;
};