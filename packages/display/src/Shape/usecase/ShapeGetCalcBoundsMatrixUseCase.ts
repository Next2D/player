import type { Graphics } from "../../Graphics";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";

/**
 * @description Graphicsの描画範囲を計算します。
 *              Calculate the drawing area of Graphics.
 * 
 * @param  {Graphics} graphics 
 * @param  {Float32Array} matrix 
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (graphics: Graphics, matrix: Float32Array): number[] =>
{
    return displayObjectCalcBoundsMatrixService(
        graphics.xMin, graphics.yMin, 
        graphics.xMax, graphics.yMax,
        matrix
    );
};