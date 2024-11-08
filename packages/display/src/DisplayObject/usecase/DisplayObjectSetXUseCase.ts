import type { DisplayObject } from "../../DisplayObject";
import { $clamp } from "../../DisplayObjectUtil";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectApplyChangesService } from "../service/DisplayObjectApplyChangesService";
import { execute as displayObjectGetRawMatrixUseCase } from "../usecase/DisplayObjectGetRawMatrixUseCase";

/**
 * @description DisplayObjectのx座標を設定
 *              Set x-coordinate of DisplayObject
 *
 * @param  {DisplayObject} display_object
 * @param  {number} x
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D, x: number): void =>
{
    x = $clamp(x, -Number.MAX_VALUE, Number.MAX_VALUE, 0);

    let matrix = display_object.$matrix;
    if (!matrix) {
        const rawData = displayObjectGetRawMatrixUseCase(display_object);
        matrix = rawData
            ? new Matrix(...rawData)
            : new Matrix();
    }

    display_object.$matrix = matrix;
    if (matrix.tx === x) {
        return;
    }

    matrix.tx = x;
    displayObjectApplyChangesService(display_object);
};