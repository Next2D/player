import type { GradientBevelFilter } from "../../GradientBevelFilter";

/**
 * @description フィルターを適用できるかどうかを返します。
 *              Returns whether the filter can be applied.
 *
 * @param  {GradientBevelFilter} gradient_bevel_filter
 * @return {boolean}
 * @method
 * @private
 */
export const execute = (gradient_bevel_filter: GradientBevelFilter): boolean =>
{
    return gradient_bevel_filter.strength > 0 
        && gradient_bevel_filter.distance > 0
        && gradient_bevel_filter.alphas !== null 
        && gradient_bevel_filter.ratios !== null 
        && gradient_bevel_filter.colors !== null
        && gradient_bevel_filter.blurX > 0
        && gradient_bevel_filter.blurY > 0
        && gradient_bevel_filter.quality > 0;
};