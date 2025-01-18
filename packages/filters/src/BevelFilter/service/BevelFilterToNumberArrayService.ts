import type { BevelFilter } from "../../BevelFilter";

/**
 * @description フィルターの設定値を数値配列で返却します。
 *              Returns a numeric array of filter settings.
 *
 * @param  {BevelFilter} bevel_filter
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (bevel_filter: BevelFilter): number[] =>
{
    let type = 0;
    switch (bevel_filter.type) {

        case "full":
            type = 0;
            break;

        case "inner":
            type = 1;
            break;

        case "outer":
            type = 2;
            break;

        default:
            break;

    }

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
        type,
        +bevel_filter.knockout
    ];
};