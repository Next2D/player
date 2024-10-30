import type { TextField } from "@next2d/text";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as textFieldGetRawBoundsService } from "../service/TextFieldGetRawBoundsService";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { $poolArray } from "../../DisplayObjectUtil";

/**
 * @description TextFieldの描画範囲を計算します。
 *              Calculate the drawing area of Shape.
 * 
 * @param  {TextField} text_field 
 * @param  {Float32Array | null} [matrix=null] 
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, matrix: Float32Array | null = null): number[] =>
{
    const rawBounds = textFieldGetRawBoundsService(text_field);

    const rawMatrix = displayObjectGetRawMatrixUseCase(text_field);
    if (!rawMatrix) {
        if (matrix) {
            const calcBounds = displayObjectCalcBoundsMatrixService(
                rawBounds[0], rawBounds[1], 
                rawBounds[2], rawBounds[3],
                matrix
            );
            $poolArray(rawBounds);
            
            return calcBounds;
        }

        return rawBounds;
    }

    const calcBounds = displayObjectCalcBoundsMatrixService(
        rawBounds[0], rawBounds[1], 
        rawBounds[2], rawBounds[3],
        matrix ? Matrix.multiply(matrix, rawMatrix) : rawMatrix
    );

    $poolArray(rawBounds);
    
    return calcBounds;
};