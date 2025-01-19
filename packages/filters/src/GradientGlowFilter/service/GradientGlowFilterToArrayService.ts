import type { GradientGlowFilter } from "../../GradientGlowFilter";

/**
 * @description フィルターの設定値を配列で返却します。
 *              Returns an array of filter settings.
 *
 * @param  {GradientGlowFilter} gradient_glow_filter
 * @return {Array<number | boolean | number[] | null | boolean | string>}
 * @method
 * @protected
 */
export const execute = (gradient_glow_filter: GradientGlowFilter): Array<number | boolean | number[] | null | boolean | string> =>
{
    return [
        gradient_glow_filter.$filterType,
        gradient_glow_filter.distance,
        gradient_glow_filter.angle,
        gradient_glow_filter.colors,
        gradient_glow_filter.alphas,
        gradient_glow_filter.ratios,
        gradient_glow_filter.blurX,
        gradient_glow_filter.blurY,
        gradient_glow_filter.strength,
        gradient_glow_filter.quality,
        gradient_glow_filter.type,
        gradient_glow_filter.knockout
    ];
};