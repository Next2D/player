import type { GlowFilter } from "../../GlowFilter";

/**
 * @description フィルターを適用できるかどうかを返します。
 *              Returns whether the filter can be applied.
 *
 * @param  {GlowFilter} glow_filter
 * @return {boolean}
 * @method
 * @private
 */
export const execute = (glow_filter: GlowFilter): boolean =>
{
    return glow_filter.alpha > 0
        && glow_filter.strength !== 0
        && glow_filter.blurX > 0
        && glow_filter.blurY > 0
        && glow_filter.quality > 0;
};