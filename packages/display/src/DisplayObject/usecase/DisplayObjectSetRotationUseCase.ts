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
    rotation = $clamp(rotation % 360, -360, 360, 0);
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

        // cosが0（sinが±1）の時のみ a/d を 0 にクリアする。
        // 以前は matrix.b の値そのものを見ていたため、scaleX×sin(θ) がたまたま
        // ±1 になるケース（例: scaleX=2, rotation=30°）で誤検出が発生し
        // matrix.a が消えて幅が潰れる不具合を起こしていた。
        const sinX = Math.sin(radianX);
        const cosX = Math.cos(radianX);
        matrix.b = scaleX * sinX;
        matrix.a = Math.abs(sinX) === 1 ? 0 : scaleX * cosX;

        const sinY = Math.sin(radianY);
        const cosY = Math.cos(radianY);
        matrix.c = -scaleY * sinY;
        matrix.d = Math.abs(sinY) === 1 ? 0 : scaleY * cosY;
    }

    display_object.$scaleX   = null;
    display_object.$scaleY   = null;
    display_object.$rotation = rotation;
    displayObjectApplyChangesService(display_object);
};