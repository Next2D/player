import type { TextField } from "@next2d/text";
import { execute as textFieldCalcBoundsMatrixUseCase } from "./TextFieldCalcBoundsMatrixUseCase";
import {
    $getBoundsArray,
    $poolBoundsArray
} from "../../DisplayObjectUtil";

/**
 * @description TextFieldのフィルター適用後の描画範囲を計算します。
 *              Calculate the drawing area of TextField after applying filters.
 *
 * @param  {TextField} text_field
 * @param  {Float32Array | null} [matrix=null]
 * @return {Float32Array}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, matrix: Float32Array | null = null): Float32Array =>
{
    const bounds = textFieldCalcBoundsMatrixUseCase(text_field, matrix);

    const filters = text_field.filters;
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
