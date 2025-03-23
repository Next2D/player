import type { GradientGlowFilter } from "../../GradientGlowFilter";
import { execute as gradientGlowFilterCanApplyFilterService } from "../service/GradientGlowFilterCanApplyFilterService";
import { execute as blurFilterGetBoundsUseCase } from "../../BlurFilter/usecase/BlurFilterGetBoundsUseCase";

/**
 * @description Filterの描画後の描画範囲を返却
 *              Returns the drawing range after drawing Filter
 *
 * @param  {GradientGlowFilter} gradient_glow_filter
 * @param  {Float32Array} bounds
 * @return {Float32Array}
 */
export const execute = (gradient_glow_filter: GradientGlowFilter, bounds: Float32Array): Float32Array =>
{
    if (!gradientGlowFilterCanApplyFilterService(gradient_glow_filter)) {
        return bounds;
    }

    if (gradient_glow_filter.type === "inner") {
        return bounds;
    }

    return blurFilterGetBoundsUseCase(gradient_glow_filter, bounds);
};