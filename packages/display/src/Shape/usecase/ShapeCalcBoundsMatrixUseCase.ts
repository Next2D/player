import type { Shape } from "../../Shape";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as shapeLocalBoundsService } from "../service/ShapeLocalBoundsService";
import { $poolArray } from "../../DisplayObjectUtil";

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
export const execute = (shape: Shape, matrix: Float32Array | null = null): number[] =>
{
    const bounds = shapeLocalBoundsService(shape);
    if (!matrix) {
        return bounds;
    }

    const calcBounds = displayObjectCalcBoundsMatrixService(
        bounds[0], bounds[1], 
        bounds[2], bounds[3],
        matrix
    );

    $poolArray(bounds);
    
    return calcBounds;
};