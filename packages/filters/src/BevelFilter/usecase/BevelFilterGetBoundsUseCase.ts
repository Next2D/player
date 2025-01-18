import type { BevelFilter } from "../../BevelFilter";
import { $Deg2Rad } from "../../FilterUtil";
import { execute as bevelFilterCanApplyFilterService } from "../service/BevelFilterCanApplyFilterService";
import { execute as blurFilterGetBoundsUseCase } from "../../BlurFilter/usecase/BlurFilterGetBoundsUseCase";

/**
 * @description BevelFilterの描画後の描画範囲を返却
 *              Returns the drawing range after drawing BevelFilter
 *
 * @param  {BevelFilter} bevel_filter
 * @param  {Float32Array} bounds
 * @return {Float32Array}
 */
export const execute = (bevel_filter: BevelFilter, bounds: Float32Array): Float32Array =>
{
    if (!bevelFilterCanApplyFilterService(bevel_filter)) {
        return bounds;
    }

    if (bevel_filter.type === "inner") {
        return bounds;
    }

    blurFilterGetBoundsUseCase(bevel_filter, bounds);

    const radian   = bevel_filter.angle * $Deg2Rad;
    const distance = bevel_filter.distance;
    const x = Math.abs(Math.cos(radian) * distance);
    const y = Math.abs(Math.sin(radian) * distance);

    bounds[0] -= x;
    bounds[2] += x;
    bounds[1] -= y;
    bounds[3] += y;

    return bounds;
};