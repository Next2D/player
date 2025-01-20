import type { DisplacementMapFilter } from "../../DisplacementMapFilter";

/**
 * @description フィルターを適用できるかどうかを返します。
 *              Returns whether the filter can be applied.
 *
 * @param  {DisplacementMapFilter} displacement_map_filter
 * @return {boolean}
 * @method
 * @private
 */
export const execute = (displacement_map_filter: DisplacementMapFilter): boolean =>
{
    return displacement_map_filter.bitmapBuffer !== null
        && displacement_map_filter.componentX > 0 
        && displacement_map_filter.componentY > 0
        && displacement_map_filter.scaleX !== 0 
        && displacement_map_filter.scaleY !== 0;
};