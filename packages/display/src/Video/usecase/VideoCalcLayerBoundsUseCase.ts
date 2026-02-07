import type { Video } from "@next2d/media";
import { execute as videoCalcBoundsMatrixUseCase } from "./VideoCalcBoundsMatrixUseCase";
import {
    $getBoundsArray,
    $poolBoundsArray
} from "../../DisplayObjectUtil";

/**
 * @description Videoのフィルター適用後の描画範囲を計算します。
 *              Calculate the drawing area of Video after applying filters.
 *
 * @param  {Video} video
 * @param  {Float32Array | null} [matrix=null]
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = (video: Video, matrix: Float32Array | null = null): Float32Array =>
{
    const bounds = videoCalcBoundsMatrixUseCase(video, matrix);

    const filters = video.filters;
    if (filters) {
        const filterBounds = $getBoundsArray(0, 0, 0, 0);
        for (let idx = 0; idx < filters.length; idx++) {
            const filter = filters[idx];
            if (!filter || !filter.canApplyFilter()) {
                continue;
            }
            filter.getBounds(filterBounds);
        }

        bounds[0] += filterBounds[0];
        bounds[1] += filterBounds[1];
        bounds[2] += filterBounds[2];
        bounds[3] += filterBounds[3];

        $poolBoundsArray(filterBounds);
    }

    return bounds;
};
