import type { DropShadowFilter } from "../../DropShadowFilter";

/**
 * @description フィルターを適用できるかどうかを返します。
 *              Returns whether the filter can be applied.
 *
 * @param  {DropShadowFilter} drop_shadow_filter
 * @return {boolean}
 * @method
 * @private
 */
export const execute = (drop_shadow_filter: DropShadowFilter): boolean =>
{
    return drop_shadow_filter.alpha > 0
        && drop_shadow_filter.strength !== 0
        && drop_shadow_filter.blurX > 0
        && drop_shadow_filter.blurY > 0
        && drop_shadow_filter.quality > 0;
};