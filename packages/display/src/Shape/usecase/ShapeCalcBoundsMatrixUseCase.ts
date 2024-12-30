import type { Shape } from "../../Shape";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as shapeGetRawBoundsService } from "../service/ShapeGetRawBoundsService";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { $poolBoundsArray } from "../../DisplayObjectUtil";

/**
 * @description Shapeの描画範囲を計算します。
 *              Calculate the drawing area of Shape.
 *
 * @param  {Shape} shape
 * @param  {Float32Array | null} [matrix=null]
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (shape: Shape, matrix: Float32Array | null = null): Float32Array =>
{
    const rawBounds = shapeGetRawBoundsService(shape);

    const rawMatrix = displayObjectGetRawMatrixUseCase(shape);
    if (!rawMatrix) {
        if (matrix) {
            const calcBounds = displayObjectCalcBoundsMatrixService(
                rawBounds[0], rawBounds[1],
                rawBounds[2], rawBounds[3],
                matrix
            );
            $poolBoundsArray(rawBounds);

            return calcBounds;
        }

        return rawBounds;
    }

    const calcBounds = displayObjectCalcBoundsMatrixService(
        rawBounds[0], rawBounds[1],
        rawBounds[2], rawBounds[3],
        matrix ? Matrix.multiply(matrix, rawMatrix) : rawMatrix
    );

    $poolBoundsArray(rawBounds);

    return calcBounds;
};