import type { DisplayObject } from "../../DisplayObject";
import { $clamp } from "../../DisplayObjectUtil";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectApplyChangesService } from "../service/DisplayObjectApplyChangesService";
import { execute as displayObjectGetRawMatrixUseCase } from "../usecase/DisplayObjectGetRawMatrixUseCase";

/**
 * @description DisplayObjectのx軸方向の拡大率を設定
 *              Set the x-axis scaling factor of the DisplayObject.
 *
 * @param  {DisplayObject} display_object
 * @param  {number} scale_x
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D, scale_x: number): void =>
{
    scale_x = $clamp(scale_x, -Number.MAX_VALUE, Number.MAX_VALUE, 1);

    const scaleX = Math.round(scale_x * 10000) / 10000;
    if (display_object.$scaleX === scaleX) {
        return ;
    }

    let matrix = display_object.$matrix;
    if (!matrix) {
        const rawData = displayObjectGetRawMatrixUseCase(display_object);
        display_object.$matrix = matrix = rawData
            ? new Matrix(...rawData)
            : new Matrix();
    }

    if (matrix.b === 0 || isNaN(matrix.b)) {

        matrix.a = scale_x;

    } else {

        let radianX = Math.atan2(matrix.b, matrix.a);
        if (radianX === -Math.PI) {
            radianX = 0;
        }

        matrix.b = scale_x * Math.sin(radianX);
        matrix.a = scale_x * Math.cos(radianX);

    }

    display_object.$scaleX = scaleX;
    displayObjectApplyChangesService(display_object);
};