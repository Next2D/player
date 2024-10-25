import { Matrix } from "@next2d/geom";
import type { DisplayObject } from "../../DisplayObject";
import { execute as displayObjectApplyChangesService } from "../service/DisplayObjectApplyChangesService";
import { execute as displayObjectGetRawMatrixUseCase } from "../usecase/DisplayObjectGetRawMatrixUseCase";

/**
 * @description DisplayObjectのy座標を設定
 *              Set y-coordinate of DisplayObject
 * 
 * @param  {DisplayObject} display_object
 * @param  {number} y
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D, y: number): void =>
{
    let matrix = display_object.$matrix;
    if (!matrix) {
        const rawData = displayObjectGetRawMatrixUseCase(display_object);
        matrix = rawData 
            ? new Matrix(...rawData) 
            : new Matrix();
    }

    display_object.$matrix = matrix;
    if (matrix.ty === y) {
        return;
    }

    matrix.ty = y;
    displayObjectApplyChangesService(display_object);
};