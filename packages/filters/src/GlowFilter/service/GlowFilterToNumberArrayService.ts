import type { GlowFilter } from "../../GlowFilter";

/**
 * @description フィルターの設定値を数値配列で返却します。
 *              Returns a numeric array of filter settings.
 *
 * @param  {GlowFilter} glow_filter
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = (glow_filter: GlowFilter): Float32Array =>
{
    return new Float32Array([
        glow_filter.$filterType,
        glow_filter.color,
        glow_filter.alpha,
        glow_filter.blurX,
        glow_filter.blurY,
        glow_filter.strength,
        glow_filter.quality,
        +glow_filter.inner,
        +glow_filter.knockout
    ]);
};