import type { GlowFilter } from "../../GlowFilter";

/**
 * @description フィルターの設定値を配列で返却します。
 *              Returns an array of filter settings.
 *
 * @param  {GlowFilter} glow_filter
 * @return {Array<number | boolean>}
 * @method
 * @protected
 */
export const execute = (glow_filter: GlowFilter): Array<number | boolean> =>
{
    return [
        glow_filter.$filterType,
        glow_filter.color,
        glow_filter.alpha,
        glow_filter.blurX,
        glow_filter.blurY,
        glow_filter.strength,
        glow_filter.quality,
        glow_filter.inner,
        glow_filter.knockout
    ];
};