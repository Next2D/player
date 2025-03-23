import type { BevelFilter } from "../../BevelFilter";

/**
 * @description フィルターを適用できるかどうかを返します。
 *              Returns whether the filter can be applied.
 *
 * @param  {BevelFilter} bevel_filter
 * @return {boolean}
 * @method
 * @private
 */
export const execute = (bevel_filter: BevelFilter): boolean =>
{
    return bevel_filter.strength > 0
        && bevel_filter.distance !== 0
        && bevel_filter.blurX > 0
        && bevel_filter.blurY > 0
        && bevel_filter.quality > 0;
};