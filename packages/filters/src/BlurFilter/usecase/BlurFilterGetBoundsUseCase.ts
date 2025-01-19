import type { BlurFilter } from "../../BlurFilter";
import type { BevelFilter } from "../../BevelFilter";
import type { DropShadowFilter } from "../../DropShadowFilter";
import type { GlowFilter } from "../../GlowFilter";
import { execute as blurFilterCanApplyFilterService } from "../service/BlurFilterCanApplyFilterService";

/**
 * @return {array}
 * @private
 */
const $STEP: number[] = [0.5, 1.05, 1.4, 1.55, 1.75, 1.9, 2, 2.15, 2.2, 2.3, 2.5, 3, 3, 3.5, 3.5];

/**
 * @description Filterの描画後の描画範囲を返却
 *              Returns the drawing range after drawing Filter
 *
 * @param  {BlurFilter} filter
 * @param  {Float32Array} bounds
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = (filter: BlurFilter | BevelFilter | DropShadowFilter | GlowFilter, bounds: Float32Array): Float32Array =>
{
    if (!blurFilterCanApplyFilterService(filter)) {
        return bounds;
    }

    const step = $STEP[filter.quality - 1];
    const dx = Math.round(filter.blurX * step);
    const dy = Math.round(filter.blurY * step);

    bounds[0] -= dx;
    bounds[2] += dx;
    bounds[1] -= dy;
    bounds[3] += dy;

    return bounds;
};