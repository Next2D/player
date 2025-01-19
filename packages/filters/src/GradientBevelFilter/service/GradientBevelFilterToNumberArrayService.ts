import type { GradientBevelFilter } from "../../GradientBevelFilter";
import { $typeToNumber } from "../../FilterUtil";

/**
 * @description フィルターの設定値を数値配列で返却します。
 *              Returns a numeric array of filter settings.
 *
 * @param  {GradientBevelFilter} gradient_bevel_filter
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (gradient_bevel_filter: GradientBevelFilter): number[] =>
{
    const colors: number[] = gradient_bevel_filter.colors ? gradient_bevel_filter.colors : [];
    const alphas: number[] = gradient_bevel_filter.alphas ? gradient_bevel_filter.alphas : [];
    const ratios: number[] = gradient_bevel_filter.ratios ? gradient_bevel_filter.ratios : [];

    return [
        gradient_bevel_filter.$filterType,
        gradient_bevel_filter.distance,
        gradient_bevel_filter.angle,
        colors.length, ...colors,
        alphas.length, ...alphas,
        ratios.length, ...ratios,
        gradient_bevel_filter.blurX,
        gradient_bevel_filter.blurY,
        gradient_bevel_filter.strength,
        gradient_bevel_filter.quality,
        $typeToNumber(gradient_bevel_filter.type),
        +gradient_bevel_filter.knockout
    ];
};