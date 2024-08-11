import type { Shape } from "../../Shape";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { $clamp } from "../../DisplayObjectUtil";
import {
    ColorTransform,
    Matrix
} from "@next2d/geom";

/**
 * @type {number}
 * @private
 */
const $RENDERER_SHAPE_TYPE: number = 0x01;

/**
 * @description renderer workerに渡すShapeの描画データを生成
 *              Generate drawing data of Shape to pass to renderer
 * 
 * @param  {Shape} shape
 * @param  {array} render_queue
 * @param  {Float32Array} matrix 
 * @param  {Float32Array} color_transform
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shape: Shape,
    render_queue: number[],
    matrix: Float32Array,
    color_transform: Float32Array,
    renderer_width: number,
    renderer_height: number,
    point_x: number,
    point_y: number
): void => {

    render_queue.push($RENDERER_SHAPE_TYPE);

    if (!shape.visible) {
        render_queue.push(0);
        return ;
    }

    const graphics = shape.graphics;
    if (!graphics.isDrawable) {
        render_queue.push(0);
        return ;
    }

    // transformed ColorTransform(tColorTransform)
    const rawColor = displayObjectGetRawColorTransformUseCase(shape);
    const tColorTransform = rawColor 
        ? ColorTransform.multiply(color_transform, rawColor)
        : color_transform;
    
    const alpha: number = $clamp(tColorTransform[3] + tColorTransform[7] / 255, 0, 1, 0);
    if (!alpha) {
        if (tColorTransform === color_transform) {
            ColorTransform.release(tColorTransform);
        }
        render_queue.push(0);
        return ;
    }

    // transformed matrix(tMatrix)
    const rawMatrix = displayObjectGetRawMatrixUseCase(shape);
    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    // draw graphics
    const bounds = displayObjectCalcBoundsMatrixService(
        graphics.xMin, graphics.yMin, 
        graphics.xMax, graphics.yMax,
        tMatrix
    );

    const xMin: number = bounds[0];
    const yMin: number = bounds[1];
    const xMax: number = bounds[2];
    const yMax: number = bounds[3];

    const width: number  = Math.ceil(Math.abs(xMax - xMin));
    const height: number = Math.ceil(Math.abs(yMax - yMin));
    switch (true) {

        case width === 0:
        case height === 0:
        case width === -Infinity:
        case height === -Infinity:
        case width === Infinity:
        case height === Infinity:
            if (tColorTransform === color_transform) {
                ColorTransform.release(tColorTransform);
            }
            if (tMatrix === matrix) {
                Matrix.release(tMatrix);
            }
            render_queue.push(0);
            return;

        default:
            break;

    }

    if (point_x > xMin + width || point_y > yMin + height
        || xMin > renderer_width || yMin > renderer_height
    ) {
        if (tColorTransform === color_transform) {
            ColorTransform.release(tColorTransform);
        }
        if (tMatrix === matrix) {
            Matrix.release(tMatrix);
        }
        render_queue.push(0);
        return;
    }

    let xScale: number = Math.sqrt(
        tMatrix[0] * tMatrix[0]
        + tMatrix[1] * tMatrix[1]
    );
    if (!Number.isInteger(xScale)) {
        const value: string = xScale.toString();
        const index: number = value.indexOf("e");
        if (index !== -1) {
            xScale = +value.slice(0, index);
        }
        xScale = +xScale.toFixed(4);
    }

    let yScale: number = Math.sqrt(
        tMatrix[2] * tMatrix[2]
        + tMatrix[3] * tMatrix[3]
    );
    if (!Number.isInteger(yScale)) {
        const value: string = yScale.toString();
        const index: number = value.indexOf("e");
        if (index !== -1) {
            yScale = +value.slice(0, index);
        }
        yScale = +yScale.toFixed(4);
    }

    // todo
    render_queue.push(1);

    if (tColorTransform === color_transform) {
        ColorTransform.release(tColorTransform);
    }
    if (tMatrix === matrix) {
        Matrix.release(tMatrix);
    }
};