import type { BlurFilter } from "../../BlurFilter";

/**
 * @description フィルターの設定値を配列で返却します。
 *              Returns an array of filter settings.
 *
 * @param  {BlurFilter} blur_filter
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (blur_filter: BlurFilter): number[] =>
{
    return [
        blur_filter.$filterType,
        blur_filter.blurX,
        blur_filter.blurY,
        blur_filter.quality
    ];
};