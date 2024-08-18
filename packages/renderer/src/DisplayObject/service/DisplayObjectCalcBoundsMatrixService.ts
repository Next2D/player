import { $getArray } from "../../RendererUtil";

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
    matrix: Float32Array,
): number[] => {

    const x0: number = x_max * matrix[0] + y_max * matrix[2] + matrix[4];
    const x1: number = x_max * matrix[0] + y_min * matrix[2] + matrix[4];
    const x2: number = x_min * matrix[0] + y_max * matrix[2] + matrix[4];
    const x3: number = x_min * matrix[0] + y_min * matrix[2] + matrix[4];
    const y0: number = x_max * matrix[1] + y_max * matrix[3] + matrix[5];
    const y1: number = x_max * matrix[1] + y_min * matrix[3] + matrix[5];
    const y2: number = x_min * matrix[1] + y_max * matrix[3] + matrix[5];
    const y3: number = x_min * matrix[1] + y_min * matrix[3] + matrix[5];

    return $getArray(
        Math.min(Number.MAX_VALUE, x0, x1, x2, x3),
        Math.max(0 - Number.MAX_VALUE, x0, x1, x2, x3),
        Math.max(0 - Number.MAX_VALUE, x0, x1, x2, x3),
        Math.max(0 - Number.MAX_VALUE, y0, y1, y2, y3)
    );
};