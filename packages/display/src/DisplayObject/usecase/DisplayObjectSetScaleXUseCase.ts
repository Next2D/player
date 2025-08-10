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

        matrix.a = scaleX;

    } else {
        const EPS = 1e-12;
        const theta = Math.atan2(matrix.b, matrix.a);

        // 現在の「符号付き scaleX」を推定（a が 0 近傍なら b で判定）
        const sxAbs = Math.hypot(matrix.a, matrix.b);
        const signX = (Math.abs(matrix.a) >= EPS ? Math.sign(matrix.a) : Math.sign(matrix.b)) || 1;
        const sxSigned = sxAbs * signX;

        // 角度正規化：scaleX を「非負」で表せる角度に直す（符号は角度から外す）
        const thetaPos = sxSigned >= 0 ? theta : theta - Math.PI;

        // ターゲットの符号を角度に載せる
        const thetaUse = thetaPos + (scaleX < 0 ? Math.PI : 0);

        const use = Math.abs(scaleX);
        matrix.a = use * Math.cos(thetaUse);
        matrix.b = use * Math.sin(thetaUse);
    }

    display_object.$scaleX = scaleX;
    displayObjectApplyChangesService(display_object);
};