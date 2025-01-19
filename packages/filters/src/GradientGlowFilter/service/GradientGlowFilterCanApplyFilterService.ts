import type { GradientGlowFilter } from "../../GradientGlowFilter";

/**
 * @description フィルターを適用できるかどうかを返します。
 *              Returns whether the filter can be applied.
 *
 * @param  {GradientGlowFilter} gradient_glow_filter
 * @return {boolean}
 * @method
 * @private
 */
export const execute = (gradient_glow_filter: GradientGlowFilter): boolean =>
{
    return gradient_glow_filter.strength > 0
        && gradient_glow_filter.distance > 0
        && gradient_glow_filter.alphas !== null
        && gradient_glow_filter.ratios !== null
        && gradient_glow_filter.colors !== null
        && gradient_glow_filter.blurX > 0
        && gradient_glow_filter.blurY > 0
        && gradient_glow_filter.quality > 0;
};