import type { DisplacementMapFilter } from "../../DisplacementMapFilter";

/**
 * @description フィルターの設定値を配列で返却します。
 *              Returns an array of filter settings.
 *
 * @param  {DisplacementMapFilter} displacement_map_filter
 * @return {Array<number | string | number[] | null>}
 * @method
 * @protected
 */
export const execute = (displacement_map_filter: DisplacementMapFilter): Array<number | string | number[] | null> =>
{
    return [
        displacement_map_filter.$filterType,
        displacement_map_filter.bitmapBuffer
            ? Array.from(displacement_map_filter.bitmapBuffer)
            : null,
        displacement_map_filter.bitmapWidth,
        displacement_map_filter.bitmapHeight,
        displacement_map_filter.mapPointX,
        displacement_map_filter.mapPointY,
        displacement_map_filter.componentX,
        displacement_map_filter.componentY,
        displacement_map_filter.scaleX,
        displacement_map_filter.scaleY,
        displacement_map_filter.mode,
        displacement_map_filter.color,
        displacement_map_filter.alpha
    ];
};