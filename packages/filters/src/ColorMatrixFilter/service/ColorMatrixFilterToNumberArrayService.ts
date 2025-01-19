import type { ColorMatrixFilter } from "../../ColorMatrixFilter";

/**
 * @description フィルターの設定値を数値配列で返却します。
 *              Returns a numeric array of filter settings.
 *
 * @param  {ColorMatrixFilter} color_matrix_filter
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (color_matrix_filter: ColorMatrixFilter): number[] =>
{
    return [
        color_matrix_filter.$filterType,
        ...color_matrix_filter.matrix
    ];
};