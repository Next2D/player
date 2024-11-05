import type { Shape } from "../../Shape";
import type { Rectangle } from"@next2d/geom";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as shapeGetRawBoundsService } from "../../Shape/service/ShapeGetRawBoundsService";
import { execute as shapeGenerateHashService } from "../service/ShapeGenerateHashService";
import { execute as displayObjectBlendToNumberService } from "../../DisplayObject/service/DisplayObjectBlendToNumberService";
import { $stage } from "../../Stage";
import { $cacheStore } from "@next2d/cache";
import {
    $clamp,
    $RENDERER_SHAPE_TYPE,
    $getArray,
    $poolArray,
    $MATRIX_ARRAY_IDENTITY,
    $getFloat32Array6,
    $poolFloat32Array6
} from "../../DisplayObjectUtil";
import {
    ColorTransform,
    Matrix
} from "@next2d/geom";
import { MovieClip } from "../../MovieClip";

/**
 * @description renderer workerに渡すShapeの描画データを生成
 *              Generate drawing data of Shape to pass to renderer
 * 
 * @param  {Shape} shape
 * @param  {array} render_queue
 * @param  {Float32Array} matrix 
 * @param  {Float32Array} color_transform
 * @param  {number} renderer_width
 * @param  {number} renderer_height
 * @param  {number} point_x
 * @param  {number} point_y
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
    const rawBounds = shapeGetRawBoundsService(shape);
    const bounds = displayObjectCalcBoundsMatrixService(
        rawBounds[0], rawBounds[1], 
        rawBounds[2], rawBounds[3],
        tMatrix
    );

    const xMin: number = bounds[0];
    const yMin: number = bounds[1];
    const xMax: number = bounds[2];
    const yMax: number = bounds[3];
    $poolArray(bounds);

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
            $poolArray(rawBounds);
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
        $poolArray(rawBounds);
        render_queue.push(0);
        return;
    }

    // rennder on
    render_queue.push(1);
    render_queue.push($RENDERER_SHAPE_TYPE);
    render_queue.push(...tMatrix, ...tColorTransform);

    // base bounds
    render_queue.push(...rawBounds);
    $poolArray(rawBounds);

    const isGridEnabled: boolean = rawMatrix && shape.scale9Grid
        ? Math.abs(rawMatrix[1]) < 0.001 && Math.abs(rawMatrix[2]) < 0.0001
        : false;

    render_queue.push(+isGridEnabled);
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

        if (isGridEnabled) {

            const scale = $stage.rendererScale;
            
            const stageMatrix = $getFloat32Array6(
                scale, 0, 0, scale, 0, 0
            );

            const pMatrix = Matrix.multiply(
                stageMatrix, 
                rawMatrix ? rawMatrix : $MATRIX_ARRAY_IDENTITY
            );
            $poolFloat32Array6(stageMatrix);

            const rawData = (shape.parent as MovieClip).concatenatedMatrix.rawData;
            const aMatrix = $getFloat32Array6(
                rawData[0], rawData[1], rawData[2], rawData[3],
                rawData[4] * scale - xMin,
                rawData[5] * scale - yMin
            );
            Matrix.release(rawData);

            const apMatrix = Matrix.multiply(aMatrix, pMatrix);
            const aOffsetX = apMatrix[4] - (tMatrix[4] - xMin);
            const aOffsetY = apMatrix[5] - (tMatrix[5] - yMin);
            $poolFloat32Array6(apMatrix);

            const parentBounds = displayObjectCalcBoundsMatrixService(
                graphics.xMin, graphics.yMin, 
                graphics.xMax, graphics.yMax,
                pMatrix
            );

            const parentXMin = parentBounds[0];
            const parentYMin = parentBounds[1];
            const parentXMax = parentBounds[2];
            const parentYMax = parentBounds[3];
            $poolArray(parentBounds);

            const parentWidth  = Math.ceil(Math.abs(parentXMax - parentXMin));
            const parentHeight = Math.ceil(Math.abs(parentYMax - parentYMin));

            const scale9Grid = shape.scale9Grid as Rectangle;

            const actualWidth  = Math.abs(graphics.xMax - graphics.xMin);
            const actualHeight = Math.abs(graphics.yMax - graphics.yMin);

            // 等倍サイズでの正規化
            const minXST = scale9Grid.width  > 0 ? (scale9Grid.x - graphics.xMin) / actualWidth  : 0.00001;
            const minYST = scale9Grid.height > 0 ? (scale9Grid.y - graphics.yMin) / actualHeight : 0.00001;
            const maxXST = scale9Grid.width  > 0 ? (scale9Grid.x + scale9Grid.width  - graphics.xMin) / actualWidth  : 0.99999;
            const maxYST = scale9Grid.height > 0 ? (scale9Grid.y + scale9Grid.height - graphics.yMin) / actualHeight : 0.99999;
    
            // 現在サイズでの正規化
            const sameWidth  = Math.ceil(actualWidth  * scale);
            const sameHeight = Math.ceil(actualHeight * scale);
            let minXPQ = sameWidth  * minXST / parentWidth;
            let minYPQ = sameHeight * minYST / parentHeight;
            let maxXPQ = (parentWidth  - sameWidth  * (1 - maxXST)) / parentWidth;
            let maxYPQ = (parentHeight - sameHeight * (1 - maxYST)) / parentHeight;

            if (minXPQ >= maxXPQ) {
                const m = minXST / (minXST + (1 - maxXST));
                minXPQ = Math.max(m - 0.00001, 0);
                maxXPQ = Math.min(m + 0.00001, 1);
            }
    
            if (minYPQ >= maxYPQ) {
                const m = minYST / (minYST + (1 - maxYST));
                minYPQ = Math.max(m - 0.00001, 0);
                maxYPQ = Math.min(m + 0.00001, 1);
            }

            render_queue.push(
                pMatrix[0], pMatrix[1], pMatrix[2], pMatrix[3], pMatrix[4], pMatrix[5],
                aMatrix[0], aMatrix[1], aMatrix[2], aMatrix[3], aMatrix[4] - aOffsetX, aMatrix[5] - aOffsetY,
                parentXMin, parentYMin, parentWidth, parentHeight,
                minXST, minYST, minXPQ, minYPQ,
                maxXST, maxYST, maxXPQ, maxYPQ
            );

            $poolFloat32Array6(aMatrix);
            $poolFloat32Array6(pMatrix);
        }

        const buffer = isDrawable || isGridEnabled
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

    const params  = [];
    if (shape.filters?.length) {
        for (let idx = 0; idx < shape.filters.length; idx++) {
            const filter = shape.filters[idx];
            if (!filter || !filter.canApplyFilter()) {
                continue;
            }

            params.push(...filter.toNumberArray());
        }
    }

    render_queue.push(
        displayObjectBlendToNumberService(shape.blendMode)
    );

    const useFilfer = params.length > 0;
    render_queue.push(+useFilfer);
    if (useFilfer) {
        render_queue.push(params.length);
        render_queue.push(...params);
    }

    if (tColorTransform !== color_transform) {
        ColorTransform.release(tColorTransform);
    }
    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }
};