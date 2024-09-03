import type { Shape } from "../../Shape";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as shapeGenerateHashService } from "../service/ShapeGenerateHashService";
import { $cacheStore } from "@next2d/cache";
import {
    $clamp,
    $RENDERER_SHAPE_TYPE,
    $getArray,
    $poolArray
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

    if (!shape.visible) {
        render_queue.push(0);
        return ;
    }

    const graphics   = shape.graphics;
    const isDrawable = graphics.isDrawable;
    if (!isDrawable && !shape.isBitmap) {
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
        if (tColorTransform !== color_transform) {
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
            if (tColorTransform !== color_transform) {
                ColorTransform.release(tColorTransform);
            }
            if (tMatrix !== matrix) {
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
        if (tColorTransform !== color_transform) {
            ColorTransform.release(tColorTransform);
        }
        if (tMatrix !== matrix) {
            Matrix.release(tMatrix);
        }
        render_queue.push(0);
        return;
    }

    // rennder on
    render_queue.push(1);
    render_queue.push($RENDERER_SHAPE_TYPE);
    render_queue.push(...tMatrix, ...tColorTransform);

    // base bounds
    render_queue.push(
        graphics.xMin, 
        graphics.yMin, 
        graphics.xMax, 
        graphics.yMax
    );
    
    const hasGrid: boolean = rawMatrix && shape.scale9Grid
        ? Math.abs(rawMatrix[1]) < 0.001 && Math.abs(rawMatrix[2]) < 0.0001
        : false;

    render_queue.push(+hasGrid);
    render_queue.push(+isDrawable);
    render_queue.push(+shape.isBitmap);

    if (!shape.uniqueKey) {
        if (shape.characterId && shape.loaderInfo) {
            
            const values = $getArray(
                shape.loaderInfo.id,
                shape.characterId
            );

            let hash = 0;
            for (let idx = 0; idx < values.length; idx++) {
                hash = (hash << 5) - hash + values[idx];
                hash |= 0;
            }

            $poolArray(values);
            shape.uniqueKey = `${hash}`;

        } else {

            shape.uniqueKey = shape.isBitmap 
                ? `${shape.instanceId}`
                : `${shapeGenerateHashService(graphics.buffer)}`;

        }
    }

    render_queue.push(+shape.uniqueKey);
    
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

    if (!shape.isBitmap 
        && !shape.cacheKey
        || shape.cacheParams[0] !== xScale
        || shape.cacheParams[1] !== yScale
        || shape.cacheParams[2] !== tColorTransform[7]
    ) {
        shape.cacheKey = $cacheStore.generateKeys(xScale, yScale, tColorTransform[7]);
        shape.cacheParams[0] = xScale;
        shape.cacheParams[1] = yScale;
        shape.cacheParams[2] = tColorTransform[7];
    }
    
    const cacheKey = shape.isBitmap
        ? 0
        : shape.cacheKey;

    render_queue.push(cacheKey);

    const cache = $cacheStore.get(shape.uniqueKey, `${cacheKey}`);
    if (!cache) {
        render_queue.push(0);

        const buffer = isDrawable
            ? graphics.buffer
            : shape.$bitmapBuffer as Uint8Array

        render_queue.push(buffer.length);
        for (let idx = 0; idx < buffer.length; idx += 4096) {
            render_queue.push(...buffer.slice(idx, idx + 4096));
        }

        $cacheStore.set(shape.uniqueKey, `${cacheKey}`, true);
    } else {
        render_queue.push(1);
    }

    if (tColorTransform !== color_transform) {
        ColorTransform.release(tColorTransform);
    }
    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }
};