import { $getBoundsArray } from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectのmatrixを考慮した描画範囲を計算
 *              Calculate the drawing range considering the matrix of DisplayObject
 *
 * @param  {number} x_min
 * @param  {number} y_min
 * @param  {number} x_max
 * @param  {number} y_max
 * @param  {Float32Array} matrix
 * @return {array}
 * @method
 * @protected
 */
export const execute = (
    x_min: number,
    y_min: number,
    x_max: number,
    y_max: number,
    matrix: Float32Array
): Float32Array => {

    const m0 = matrix[0];
    const m1 = matrix[1];
    const m2 = matrix[2];
    const m3 = matrix[3];
    const m4 = matrix[4];
    const m5 = matrix[5];

    const x0 = x_max * m0 + y_max * m2 + m4;
    const x1 = x_max * m0 + y_min * m2 + m4;
    const x2 = x_min * m0 + y_max * m2 + m4;
    const x3 = x_min * m0 + y_min * m2 + m4;
    const y0 = x_max * m1 + y_max * m3 + m5;
    const y1 = x_max * m1 + y_min * m3 + m5;
    const y2 = x_min * m1 + y_max * m3 + m5;
    const y3 = x_min * m1 + y_min * m3 + m5;

    return $getBoundsArray(
        Math.min(x0, x1, x2, x3),
        Math.min(y0, y1, y2, y3),
        Math.max(x0, x1, x2, x3),
        Math.max(y0, y1, y2, y3)
    );
};