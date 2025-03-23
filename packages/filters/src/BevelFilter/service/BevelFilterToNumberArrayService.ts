import type { BevelFilter } from "../../BevelFilter";
import { $typeToNumber } from "../../FilterUtil";

/**
 * @description フィルターの設定値を数値配列で返却します。
 *              Returns a numeric array of filter settings.
 *
 * @param  {BevelFilter} bevel_filter
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = (bevel_filter: BevelFilter): Float32Array =>
{
    return new Float32Array([
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
        $typeToNumber(bevel_filter.type),
        +bevel_filter.knockout
    ]);
};