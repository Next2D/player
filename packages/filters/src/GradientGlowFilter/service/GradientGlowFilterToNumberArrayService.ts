import type { GradientGlowFilter } from "../../GradientGlowFilter";
import { $typeToNumber } from "../../FilterUtil";

/**
 * @description フィルターの設定値を数値配列で返却します。
 *              Returns a numeric array of filter settings.
 *
 * @param  {GradientGlowFilter} gradient_glow_filter
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (gradient_glow_filter: GradientGlowFilter): number[] =>
{
    const colors: number[] = gradient_glow_filter.colors ? gradient_glow_filter.colors : [];
    const alphas: number[] = gradient_glow_filter.alphas ? gradient_glow_filter.alphas : [];
    const ratios: number[] = gradient_glow_filter.ratios ? gradient_glow_filter.ratios : [];

    return [
        gradient_glow_filter.$filterType,
        gradient_glow_filter.distance,
        gradient_glow_filter.angle,
        colors.length, ...colors,
        alphas.length, ...alphas,
        ratios.length, ...ratios,
        gradient_glow_filter.blurX,
        gradient_glow_filter.blurY,
        gradient_glow_filter.strength,
        gradient_glow_filter.quality,
        $typeToNumber(gradient_glow_filter.type),
        +gradient_glow_filter.knockout
    ];
};