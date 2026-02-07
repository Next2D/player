import type { Shape } from "../../Shape";
import { execute as shapeCalcBoundsMatrixUseCase } from "./ShapeCalcBoundsMatrixUseCase";
import {
    $getBoundsArray,
    $poolBoundsArray
} from "../../DisplayObjectUtil";

/**
 * @description Shapeのフィルター適用後の描画範囲を計算します。
 *              Calculate the drawing area of Shape after applying filters.
 *
 * @param  {Shape} shape
 * @param  {Float32Array | null} [matrix=null]
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = (shape: Shape, matrix: Float32Array | null = null): Float32Array =>
{
    const bounds = shapeCalcBoundsMatrixUseCase(shape, matrix);

    const filters = shape.filters;
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
