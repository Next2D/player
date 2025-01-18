import type { BevelFilter } from "../../BevelFilter";

/**
 * @description フィルターの設定値を配列で返却します。
 *              Returns an array of filter settings.
 *
 * @param  {BevelFilter} bevel_filter
 * @return {Array<number | string | boolean>}
 * @method
 * @protected
 */
export const execute = (bevel_filter: BevelFilter): Array<number | string | boolean> =>
{
    return [
        bevel_filter.$filterType,
        bevel_filter.distance,
        bevel_filter.angle,
        bevel_filter.highlightColor,
        bevel_filter.highlightAlpha,
        bevel_filter.shadowColor,
        bevel_filter.shadowAlpha,
        bevel_filter.blurX,
        bevel_filter.blurY,
        bevel_filter.strength,
        bevel_filter.quality,
        bevel_filter.type,
        bevel_filter.knockout
    ];
};