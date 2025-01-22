import type { ColorMatrixFilter } from "../../ColorMatrixFilter";

/**
 * @description フィルターの設定値を数値配列で返却します。
 *              Returns a numeric array of filter settings.
 *
 * @param  {ColorMatrixFilter} color_matrix_filter
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = (color_matrix_filter: ColorMatrixFilter): Float32Array =>
{
    return new Float32Array([
        color_matrix_filter.$filterType,
        ...color_matrix_filter.matrix
    ]);
};