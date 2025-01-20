import type { DisplacementMapFilter } from "../../DisplacementMapFilter";

/**
 * @description フィルターの設定値を数値配列で返却します。
 *              Returns a numeric array of filter settings.
 *
 * @param  {DisplacementMapFilter} displacement_map_filter
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (displacement_map_filter: DisplacementMapFilter): number[] =>
{
    let mode = 2;
    switch (displacement_map_filter.mode) {

        case "clamp":
            mode = 0;
            break;

        case "color":
            mode = 1;
            break;

        case "wrap":
            mode = 2;
            break;

        case "ignore":
            mode = 3;
            break;

        default:
            mode = 2;
            break;

    }

    const buffer = displacement_map_filter.bitmapBuffer || new Uint8Array();
    const array = [displacement_map_filter.$filterType, buffer.length];

    for (let idx = 0; idx < buffer.length; idx += 4096) {
        array.push(...buffer.subarray(idx, idx + 4096));
    }

    array.push(
        displacement_map_filter.bitmapWidth,
        displacement_map_filter.bitmapHeight,
        displacement_map_filter.mapPointX,
        displacement_map_filter.mapPointY,
        displacement_map_filter.componentX,
        displacement_map_filter.componentY,
        displacement_map_filter.scaleX,
        displacement_map_filter.scaleY,
        mode,
        displacement_map_filter.color,
        displacement_map_filter.alpha
    );

    return array;
};