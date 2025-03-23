import type { GradientBevelFilter } from "../../GradientBevelFilter";
import { $Deg2Rad } from "../../FilterUtil";
import { execute as gradientBevelFilterCanApplyFilterService } from "../service/GradientBevelFilterCanApplyFilterService";
import { execute as blurFilterGetBoundsUseCase } from "../../BlurFilter/usecase/BlurFilterGetBoundsUseCase";

/**
 * @description Filterの描画後の描画範囲を返却
 *              Returns the drawing range after drawing Filter
 *
 * @param  {GradientBevelFilter} gradient_bevel_filter
 * @param  {Float32Array} bounds
 * @return {Float32Array}
 */
export const execute = (gradient_bevel_filter: GradientBevelFilter, bounds: Float32Array): Float32Array =>
{
    if (!gradientBevelFilterCanApplyFilterService(gradient_bevel_filter)) {
        return bounds;
    }

    if (gradient_bevel_filter.type === "inner") {
        return bounds;
    }

    blurFilterGetBoundsUseCase(gradient_bevel_filter, bounds);

    const radian   = gradient_bevel_filter.angle * $Deg2Rad;
    const distance = gradient_bevel_filter.distance;
    const x = Math.abs(Math.cos(radian) * distance);
    const y = Math.abs(Math.sin(radian) * distance);

    bounds[0] -= x;
    bounds[2] += x;
    bounds[1] -= y;
    bounds[3] += y;

    return bounds;
};