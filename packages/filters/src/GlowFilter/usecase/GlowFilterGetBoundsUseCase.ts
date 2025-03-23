import type { GlowFilter } from "../../GlowFilter";
import { execute as glowFilterCanApplyFilterService } from "../service/GlowFilterCanApplyFilterService";
import { execute as blurFilterGetBoundsUseCase } from "../../BlurFilter/usecase/BlurFilterGetBoundsUseCase";

/**
 * @description Filterの描画後の描画範囲を返却
 *              Returns the drawing range after drawing Filter
 *
 * @param  {GlowFilter} glow_filter
 * @param  {Float32Array} bounds
 * @return {Float32Array}
 */
export const execute = (glow_filter: GlowFilter, bounds: Float32Array): Float32Array =>
{
    if (!glowFilterCanApplyFilterService(glow_filter)) {
        return bounds;
    }

    if (glow_filter.inner) {
        return bounds;
    }

    return blurFilterGetBoundsUseCase(glow_filter, bounds);
};