import type { DropShadowFilter } from "../../DropShadowFilter";
import { $Deg2Rad } from "../../FilterUtil";
import { execute as dropShadowFilterCanApplyFilterService } from "../service/DropShadowFilterCanApplyFilterService";
import { execute as blurFilterGetBoundsUseCase } from "../../BlurFilter/usecase/BlurFilterGetBoundsUseCase";

/**
 * @description Filterの描画後の描画範囲を返却
 *              Returns the drawing range after drawing Filter
 *
 * @param  {DropShadowFilter} drop_shadow_filter
 * @param  {Float32Array} bounds
 * @return {Float32Array}
 */
export const execute = (drop_shadow_filter: DropShadowFilter, bounds: Float32Array): Float32Array =>
{
    if (!dropShadowFilterCanApplyFilterService(drop_shadow_filter)) {
        return bounds;
    }

    if (drop_shadow_filter.inner) {
        return bounds;
    }

    blurFilterGetBoundsUseCase(drop_shadow_filter, bounds);

    const radian   = drop_shadow_filter.angle * $Deg2Rad;
    const distance = drop_shadow_filter.distance;

    const x = Math.cos(radian) * distance;
    const y = Math.sin(radian) * distance;

    bounds[0] = Math.min(bounds[0], x);
    if (x > 0) {
        bounds[2] += x;
    }

    bounds[1] = Math.min(bounds[1], y);
    if (y > 0) {
        bounds[3] += y;
    }

    return bounds;
};