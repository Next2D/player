import type { Shape } from "../../Shape";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as shapeGenerateHashService } from "../service/ShapeGenerateHashService";
import { $cacheStore } from "@next2d/cache";
import {
    $clamp,
    $RENDERER_SHAPE_TYPE
} from "../../DisplayObjectUtil";
import {
    ColorTransform,
    Matrix
} from "@next2d/geom";

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

    if (point_x > xMin + width 
        || point_y > yMin + height
        || xMin > renderer_width 
        || yMin > renderer_height
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

    // rennder on
    render_queue.push(1);
    render_queue.push(...tMatrix, ...tColorTransform);

    const hasGrid: boolean = rawMatrix && shape.scale9Grid
        ? Math.abs(rawMatrix[1]) < 0.001 && Math.abs(rawMatrix[2]) < 0.0001
        : false;

    render_queue.push(+hasGrid);

    // base bounds
    render_queue.push(
        graphics.xMin, 
        graphics.yMin, 
        graphics.xMax, 
        graphics.yMax
    );

    if (!shape.uniqueKey) {
        if (shape.characterId && shape.loaderInfo) {

            // key length
            render_queue.push(2);

            const loaderInfo = shape.loaderInfo;
            render_queue.push(loaderInfo.id);
            render_queue.push(shape.characterId);

            shape.uniqueKey = `${loaderInfo.id}@${shape.characterId}`;

        } else {

            // key length
            render_queue.push(1);

            const hash = shapeGenerateHashService(graphics.buffer);
            render_queue.push(hash);
            shape.uniqueKey = `${hash}`;

        }
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

    if (!shape.cacheKey
        || shape.cacheParams[0] !== xScale
        || shape.cacheParams[1] !== yScale
        || shape.cacheParams[2] !== tColorTransform[7]
    ) {
        shape.cacheKey = $cacheStore.generateKeys(xScale, yScale, tColorTransform[7]);
        shape.cacheParams[0] = xScale;
        shape.cacheParams[1] = yScale;
        shape.cacheParams[2] = tColorTransform[7];
    }
    
    const cacheKey = shape.cacheKey;

    render_queue.push(cacheKey);
    const cachePosition = $cacheStore.get(shape.uniqueKey, `${cacheKey}`);
    if (!cachePosition) {
        render_queue.push(0);

        const buffer = graphics.buffer;
        render_queue.push(buffer.length, ...buffer);

        $cacheStore.set(shape.uniqueKey, `${cacheKey}`, true);

    } else {
        render_queue.push(1);
    }

    if (tColorTransform === color_transform) {
        ColorTransform.release(tColorTransform);
    }
    if (tMatrix === matrix) {
        Matrix.release(tMatrix);
    }
};