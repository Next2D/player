import type { ColorMatrixFilter } from "../../ColorMatrixFilter";

/**
 * @description フィルターの設定値を配列で返却します。
 *              Returns an array of filter settings.
 *
 * @param  {BevelFilter} color_matrix_filter
 * @return {Array<number | number[]>}
 * @method
 * @protected
 */
export const execute = (color_matrix_filter: ColorMatrixFilter): Array<number | number[]> =>
{
    return [
        color_matrix_filter.$filterType,
        color_matrix_filter.matrix
    ];
};