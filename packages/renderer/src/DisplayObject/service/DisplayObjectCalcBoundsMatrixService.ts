import { $getBoundsArray } from "../../RendererUtil";

/**
 * @description DisplayObjectのmatrixを考慮した描画範囲を計算
 *              Calculate the drawing range considering the matrix of DisplayObject
 *
 * @param  {number} x_min
 * @param  {number} y_min
 * @param  {number} x_max
 * @param  {number} y_max
 * @param  {Float32Array} matrix
 * @return {Float32Array}
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

    const x0 = x_max * matrix[0];
    const x1 = x_min * matrix[0];
    const y0 = y_max * matrix[2];
    const y1 = y_min * matrix[2];

    const tx0 = x0 + y0 + matrix[4];
    const tx1 = x0 + y1 + matrix[4];
    const tx2 = x1 + y0 + matrix[4];
    const tx3 = x1 + y1 + matrix[4];

    const y0_1 = x_max * matrix[1];
    const y1_1 = x_min * matrix[1];
    const z0 = y_max * matrix[3];
    const z1 = y_min * matrix[3];

    const ty0 = y0_1 + z0 + matrix[5];
    const ty1 = y0_1 + z1 + matrix[5];
    const ty2 = y1_1 + z0 + matrix[5];
    const ty3 = y1_1 + z1 + matrix[5];

    return $getBoundsArray(
        Math.min(tx0, tx1, tx2, tx3),  // x_min
        Math.min(ty0, ty1, ty2, ty3),  // y_min
        Math.max(tx0, tx1, tx2, tx3),  // x_max
        Math.max(ty0, ty1, ty2, ty3)   // y_max
    );
};