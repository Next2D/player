import type { DisplayObject } from "../../DisplayObject";
import { $clamp } from "../../DisplayObjectUtil";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectApplyChangesService } from "../service/DisplayObjectApplyChangesService";
import { execute as displayObjectGetRawMatrixUseCase } from "../usecase/DisplayObjectGetRawMatrixUseCase";

/**
 * @description DisplayObjectのy軸方向の拡大率を設定
 *              Set the y-axis scaling factor of the DisplayObject.
 *
 * @param  {DisplayObject} display_object
 * @param  {number} scale_y
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D, scale_y: number): void =>
{
    scale_y = $clamp(scale_y, -Number.MAX_VALUE, Number.MAX_VALUE, 1);

    const scaleY = Math.round(scale_y * 10000) / 10000;
    if (display_object.$scaleY === scaleY) {
        return ;
    }

    let matrix = display_object.$matrix;
    if (!matrix) {
        const rawData = displayObjectGetRawMatrixUseCase(display_object);
        display_object.$matrix = matrix = rawData
            ? new Matrix(...rawData)
            : new Matrix();
    }

    if (matrix.c === 0 || isNaN(matrix.c)) {

        matrix.d = scale_y;

    } else {

        let radianY = Math.atan2(-matrix.c, matrix.d);
        if (radianY === -Math.PI) {
            radianY = 0;
        }
        matrix.c = -scale_y * Math.sin(radianY);
        matrix.d = scale_y  * Math.cos(radianY);

    }

    display_object.$scaleY = scaleY;
    displayObjectApplyChangesService(display_object);
};