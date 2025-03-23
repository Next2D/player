import { Matrix } from "@next2d/geom";
import type { DisplayObject } from "../../DisplayObject";
import { $clamp } from "../../DisplayObjectUtil";
import { execute as displayObjectApplyChangesService } from "../service/DisplayObjectApplyChangesService";
import { execute as displayObjectGetRawMatrixUseCase } from "../usecase/DisplayObjectGetRawMatrixUseCase";

/**
 * @type {number}
 * @private
 */
const $Deg2Rad: number = Math.PI / 180;

/**
 * @description DisplayObjectの回転値を設定
 *              Set DisplayObject rotation value
 *
 * @param  {DisplayObject} display_object
 * @param  {number} rotation
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D, rotation: number): void =>
{
    rotation = $clamp(rotation % 360, 0 - 360, 360, 0);
    if (display_object.$rotation === rotation) {
        return ;
    }

    let matrix = display_object.$matrix;
    if (!matrix) {
        const rawData = displayObjectGetRawMatrixUseCase(display_object);
        display_object.$matrix = matrix = rawData
            ? new Matrix(...rawData)
            : new Matrix();
    }

    const scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
    const scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
    if (rotation === 0) {
        matrix.a = scaleX;
        matrix.b = 0;
        matrix.c = 0;
        matrix.d = scaleY;
    } else {

        let radianX = Math.atan2(matrix.b,  matrix.a);
        let radianY = Math.atan2(-matrix.c, matrix.d);

        const radian = rotation * $Deg2Rad;
        radianY = radianY + radian - radianX;
        radianX = radian;

        matrix.b = scaleX * Math.sin(radianX);
        if (matrix.b === 1 || matrix.b === -1) {
            matrix.a = 0;
        } else {
            matrix.a = scaleX * Math.cos(radianX);
        }

        matrix.c = -scaleY * Math.sin(radianY);
        if (matrix.c === 1 || matrix.c === -1) {
            matrix.d = 0;
        } else {
            matrix.d = scaleY * Math.cos(radianY);
        }
    }

    display_object.$rotation = rotation;
    displayObjectApplyChangesService(display_object);
};