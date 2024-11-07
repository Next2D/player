import type { TextField } from "@next2d/text";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as displayObjectBlendToNumberService } from "../../DisplayObject/service/DisplayObjectBlendToNumberService";
import { execute as textFieldGetRawBoundsService } from "../../TextField/service/TextFieldGetRawBoundsService";
import { $cacheStore } from "@next2d/cache";
import {
    $clamp,
    $RENDERER_TEXT_TYPE,
    $getArray,
    $poolArray
} from "../../DisplayObjectUtil";
import {
    ColorTransform,
    Matrix
} from "@next2d/geom";

/**
 * @type {TextEncoder}
 * @private
 */
const $textEncoder: TextEncoder = new TextEncoder();

/**
 * @description renderer workerに渡すtext_fieldの描画データを生成
 *              Generate drawing data of text_field to pass to renderer
 * 
 * @param  {TextField} text_field
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
    text_field: TextField,
    render_queue: number[],
    matrix: Float32Array,
    color_transform: Float32Array,
    renderer_width: number,
    renderer_height: number,
    point_x: number,
    point_y: number
): void => {

    if (!text_field.visible || !text_field.text) {
        render_queue.push(0);
        return ;
    }

    // transformed ColorTransform(tColorTransform)
    const rawColor = displayObjectGetRawColorTransformUseCase(text_field);
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
    const rawMatrix = displayObjectGetRawMatrixUseCase(text_field);
    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    // draw text
    const rawBounds = textFieldGetRawBoundsService(text_field);
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
    render_queue.push($RENDERER_TEXT_TYPE);
    render_queue.push(...tMatrix, ...tColorTransform);

    // base bounds
    render_queue.push(...rawBounds);
    $poolArray(rawBounds);

    if (!text_field.uniqueKey) {
        if (text_field.characterId && text_field.loaderInfo) {
            
            const values = $getArray(
                text_field.loaderInfo.id,
                text_field.characterId
            );

            let hash = 0;
            for (let idx = 0; idx < values.length; idx++) {
                hash = (hash << 5) - hash + values[idx];
                hash |= 0;
            }

            $poolArray(values);
            text_field.uniqueKey = `${hash}`;

        } else {

            text_field.uniqueKey = `${text_field.instanceId}`;

        }
    }

    render_queue.push(+text_field.uniqueKey);

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

    if (text_field.changed 
        && !text_field.cacheKey
        || text_field.cacheParams[0] !== xScale
        || text_field.cacheParams[1] !== yScale
        || text_field.cacheParams[2] !== tColorTransform[7]
    ) {
        text_field.cacheKey = $cacheStore.generateKeys(xScale, yScale, tColorTransform[7]);
        text_field.cacheParams[0] = xScale;
        text_field.cacheParams[1] = yScale;
        text_field.cacheParams[2] = tColorTransform[7];
    }

    const cacheKey = text_field.cacheKey;
    render_queue.push(cacheKey);

    const cache = $cacheStore.get(text_field.uniqueKey, `${cacheKey}`);
    if (!cache || text_field.changed) {

        // cache none
        render_queue.push(0);

        // has cache
        render_queue.push(+cache);

        const buffer = $textEncoder.encode(JSON.stringify(text_field.$textData));
        
        render_queue.push(buffer.length);
        for (let idx = 0; idx < buffer.length; idx += 4096) {
            render_queue.push(...buffer.slice(idx, idx + 4096));
        }

        // text setting
        switch (text_field.autoSize) {

            case "center":
                render_queue.push(0);
                break;

            case "left":
                render_queue.push(1);
                break;

            case "none":
                render_queue.push(2);
                break;

            case "right":
                render_queue.push(3);
                break;

        }
        
        render_queue.push(text_field.stopIndex);
        render_queue.push(text_field.scrollX);
        render_queue.push(text_field.scrollY);
        render_queue.push(text_field.textWidth);
        render_queue.push(text_field.textHeight);
        render_queue.push(Math.abs(text_field.xMax - text_field.xMin));
        render_queue.push(Math.abs(text_field.yMax - text_field.yMin));
        render_queue.push(text_field.focusIndex);
        render_queue.push(+text_field.focusVisible);
        render_queue.push(text_field.thickness);
        render_queue.push(text_field.thicknessColor);
        render_queue.push(+text_field.wordWrap);
        render_queue.push(+text_field.border);
        render_queue.push(text_field.borderColor);
        render_queue.push(+text_field.background);
        render_queue.push(text_field.backgroundColor);
        render_queue.push(text_field.defaultTextFormat.color || 0);
        render_queue.push(text_field.defaultTextFormat.size || 0);

        if (!cache) {
            $cacheStore.set(text_field.uniqueKey, `${cacheKey}`, true);
        }
    } else {
        render_queue.push(1);
    }

    const params  = [];
    if (text_field.filters?.length) {
        for (let idx = 0; idx < text_field.filters.length; idx++) {
            const filter = text_field.filters[idx];
            if (!filter || !filter.canApplyFilter()) {
                continue;
            }

            params.push(...filter.toNumberArray());
        }
    }

    render_queue.push(
        displayObjectBlendToNumberService(text_field.blendMode)
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
}