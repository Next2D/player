import type { GradientBevelFilter } from "../../GradientBevelFilter";

/**
 * @description フィルターの設定値を配列で返却します。
 *              Returns an array of filter settings.
 *
 * @param  {GradientBevelFilter} gradient_bevel_filter
 * @return {Array<number | boolean | number[] | null | boolean | string>}
 * @method
 * @protected
 */
export const execute = (gradient_bevel_filter: GradientBevelFilter): Array<number | boolean | number[] | null | boolean | string> =>
{
    return [
        gradient_bevel_filter.$filterType,
        gradient_bevel_filter.distance,
        gradient_bevel_filter.angle,
        gradient_bevel_filter.colors,
        gradient_bevel_filter.alphas,
        gradient_bevel_filter.ratios,
        gradient_bevel_filter.blurX,
        gradient_bevel_filter.blurY,
        gradient_bevel_filter.strength,
        gradient_bevel_filter.quality,
        gradient_bevel_filter.type,
        gradient_bevel_filter.knockout
    ];
};