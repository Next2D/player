import type { Video } from "@next2d/media";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as videoGetRawBoundsService } from "../service/VideoGetRawBoundsService";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { $poolArray } from "../../DisplayObjectUtil";

/**
 * @description Shapeの描画範囲を計算します。
 *              Calculate the drawing area of Shape.
 *
 * @param  {Video} video
 * @param  {Float32Array | null} [matrix=null]
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (video: Video, matrix: Float32Array | null = null): number[] =>
{
    const rawBounds = videoGetRawBoundsService(video);

    const rawMatrix = displayObjectGetRawMatrixUseCase(video);
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