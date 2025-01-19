import type { BlurFilter } from "../../BlurFilter";
import type { BevelFilter } from "../../BevelFilter";
import type { DropShadowFilter } from "../../DropShadowFilter";
import type { GlowFilter } from "../../GlowFilter";

/**
 * @description フィルターを適用できるかどうかを返します。
 *              Returns whether the filter can be applied.
 *
 * @param  {BlurFilter} filter
 * @return {boolean}
 * @method
 * @private
 */
export const execute = (filter: BlurFilter | BevelFilter | DropShadowFilter | GlowFilter): boolean =>
{
    return filter.blurX > 0 && filter.blurY > 0 && filter.quality > 0;
};