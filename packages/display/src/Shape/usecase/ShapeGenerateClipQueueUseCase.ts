import type { Shape } from "../../Shape";
import { Matrix } from "@next2d/geom";
import { $RENDERER_SHAPE_TYPE } from "../../DisplayObjectUtil";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";

/**
 * @description renderer workerに渡すShapeのマスク描画データを生成
 *              Generate mask drawing data of Shape to pass to renderer worker
 * 
 * @param  {Shape} shape 
 * @param  {array} render_queue 
 * @param  {Float32Array} matrix 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shape: Shape,
    render_queue: number[],
    matrix: Float32Array
): void => {

    render_queue.push($RENDERER_SHAPE_TYPE);

    // transformed matrix(tMatrix)
    const rawMatrix = displayObjectGetRawMatrixUseCase(shape);
    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    render_queue.push(...tMatrix);
    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }
    
    const hasGrid: boolean = rawMatrix && shape.scale9Grid
        ? Math.abs(rawMatrix[1]) < 0.001 && Math.abs(rawMatrix[2]) < 0.0001
        : false;

    render_queue.push(+hasGrid);

    const buffer = shape.graphics.buffer;
    render_queue.push(buffer.length, ...buffer);
};