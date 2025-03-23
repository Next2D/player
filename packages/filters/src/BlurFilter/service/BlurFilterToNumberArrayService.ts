import type { BlurFilter } from "../../BlurFilter";

/**
 * @description フィルターの設定値を配列で返却します。
 *              Returns an array of filter settings.
 *
 * @param  {BlurFilter} blur_filter
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = (blur_filter: BlurFilter): Float32Array =>
{
    return new Float32Array([
        blur_filter.$filterType,
        blur_filter.blurX,
        blur_filter.blurY,
        blur_filter.quality
    ]);
};