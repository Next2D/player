import type { Shape } from "../../Shape";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as shapeGetRawBoundsService } from "../service/ShapeGetRawBoundsService";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import {
    $poolBoundsArray,
    $getFloat32Array6,
    $poolFloat32Array6
} from "../../DisplayObjectUtil";

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

    let rawMatrix = displayObjectGetRawMatrixUseCase(shape);

    // cacheAsBitmap倍率をrawMatrixに適用
    const cacheMatrix = shape.cacheAsBitmap;
    let scaledMatrix: Float32Array | null = null;
    if (cacheMatrix) {
        const m = cacheMatrix.rawData;
        const csx = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
        const csy = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
        if (rawMatrix) {
            scaledMatrix = $getFloat32Array6(
                rawMatrix[0] * csx, rawMatrix[1] * csx,
                rawMatrix[2] * csy, rawMatrix[3] * csy,
                rawMatrix[4], rawMatrix[5]
            );
        } else {
            scaledMatrix = $getFloat32Array6(csx, 0, 0, csy, 0, 0);
        }
        rawMatrix = scaledMatrix;
    }

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

    if (scaledMatrix) {
        $poolFloat32Array6(scaledMatrix);
    }
    $poolBoundsArray(rawBounds);

    return calcBounds;
};