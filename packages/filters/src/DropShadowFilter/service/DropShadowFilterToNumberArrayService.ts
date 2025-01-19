import type { DropShadowFilter } from "../../DropShadowFilter";

/**
 * @description フィルターの設定値を数値配列で返却します。
 *              Returns a numeric array of filter settings.
 *
 * @param  {DropShadowFilter} drop_shadow_filter
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (drop_shadow_filter: DropShadowFilter): number[] =>
{
    return [
        drop_shadow_filter.$filterType,
        drop_shadow_filter.distance,
        drop_shadow_filter.angle,
        drop_shadow_filter.color,
        drop_shadow_filter.alpha,
        drop_shadow_filter.blurX,
        drop_shadow_filter.blurY,
        drop_shadow_filter.strength,
        drop_shadow_filter.quality,
        +drop_shadow_filter.inner,
        +drop_shadow_filter.knockout,
        +drop_shadow_filter.hideObject
    ];
};