import type { BlurFilter } from "../../BlurFilter";
import type { BevelFilter } from "../../BevelFilter";
import type { DropShadowFilter } from "../../DropShadowFilter";
import type { GlowFilter } from "../../GlowFilter";
import type { GradientBevelFilter } from "../../GradientBevelFilter";
import type { GradientGlowFilter } from "../../GradientGlowFilter";

/**
 * @description フィルターを適用できるかどうかを返します。
 *              Returns whether the filter can be applied.
 *
 * @param  {BlurFilter} filter
 * @return {boolean}
 * @method
 * @private
 */
export const execute = (filter: BlurFilter | BevelFilter | DropShadowFilter | GlowFilter | GradientBevelFilter | GradientGlowFilter): boolean =>
{
    return filter.blurX > 0 && filter.blurY > 0 && filter.quality > 0;
};