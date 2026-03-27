import type { TextField } from "@next2d/text";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as displayObjectBlendToNumberService } from "../../DisplayObject/service/DisplayObjectBlendToNumberService";
import { execute as displayObjectGenerateHashService } from "../../DisplayObject/service/DisplayObjectGenerateHashService";
import { $cacheStore } from "@next2d/cache";
import { renderQueue } from "@next2d/render-queue";
import { stage } from "../../Stage";
import {
    $clamp,
    $RENDERER_TEXT_TYPE,
    $getArray,
    $poolArray,
    $poolBoundsArray,
    $getBoundsArray
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
 * @description renderer workerに渡すTextFieldの描画データを生成
 *              Generate drawing data of TextField to pass to renderer
 *
 * @param  {TextField} text_field
 * @param  {Float32Array} matrix
 * @param  {Float32Array} color_transform
 * @param  {number} renderer_width
 * @param  {number} renderer_height
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    text_field: TextField,
    matrix: Float32Array,
    color_transform: Float32Array,
    renderer_width: number,
    renderer_height: number
): void => {

    if (!text_field.visible) {
        renderQueue.push(0);
        return ;
    }

    // transformed ColorTransform(tColorTransform)
    const rawColor = displayObjectGetRawColorTransformUseCase(text_field as any);
    const tColorTransform = rawColor
        && (rawColor[0] !== 1 || rawColor[1] !== 1
            || rawColor[2] !== 1 || rawColor[3] !== 1
            || rawColor[4] !== 0 || rawColor[5] !== 0
            || rawColor[6] !== 0 || rawColor[7] !== 0)
        ? ColorTransform.multiply(color_transform, rawColor)
        : color_transform;

    const alpha = $clamp(tColorTransform[3] + tColorTransform[7] / 255, 0, 1, 0);
    if (!alpha) {
        if (tColorTransform !== color_transform) {
            ColorTransform.release(tColorTransform);
        }
        renderQueue.push(0);
        return ;
    }

    // transformed matrix(tMatrix)
    const rawMatrix = displayObjectGetRawMatrixUseCase(text_field as any);
    const tMatrix = rawMatrix
        && (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0)
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    const bounds = displayObjectCalcBoundsMatrixService(
        text_field.xMin, text_field.yMin,
        text_field.xMax, text_field.yMax,
        tMatrix
    );

    const xMin = bounds[0];
    const yMin = bounds[1];
    const xMax = bounds[2];
    const yMax = bounds[3];
    $poolBoundsArray(bounds);

    const width  = Math.ceil(Math.abs(xMax - xMin));
    const height = Math.ceil(Math.abs(yMax - yMin));
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
            renderQueue.push(0);
            return;

        default:
            break;

    }

    if (0 > xMin + width
        || 0 > yMin + height
        || xMin > renderer_width
        || yMin > renderer_height
    ) {
        if (tColorTransform !== color_transform) {
            ColorTransform.release(tColorTransform);
        }
        if (tMatrix !== matrix) {
            Matrix.release(tMatrix);
        }
        renderQueue.push(0);
        return;
    }

    if (!text_field.uniqueKey) {
        if (text_field.characterId && text_field.loaderInfo) {

            const values = $getArray(
                text_field.loaderInfo.id,
                text_field.characterId
            );

            text_field.uniqueKey = `${displayObjectGenerateHashService(new Float32Array(values))}`;
            $poolArray(values);

        } else {

            text_field.uniqueKey = `${text_field.instanceId}`;

        }
    }

    // cacheAsBitmap: 指定Matrix × 自身のスケール × stageのrendererScaleでキャッシュ品質を決定
    // 1.0基準: Matrix(1,0,0,1)はdisplayObjectの等倍スケールを意味する
    const cacheMatrix = (text_field as any).cacheAsBitmap;
    let renderXScale: number;
    let renderYScale: number;
    if (cacheMatrix) {
        const m = cacheMatrix.rawData;
        const cacheScaleX = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
        const cacheScaleY = Math.sqrt(m[2] * m[2] + m[3] * m[3]);

        const ownScaleX = rawMatrix
            ? Math.sqrt(rawMatrix[0] * rawMatrix[0] + rawMatrix[1] * rawMatrix[1])
            : 1;
        const ownScaleY = rawMatrix
            ? Math.sqrt(rawMatrix[2] * rawMatrix[2] + rawMatrix[3] * rawMatrix[3])
            : 1;

        renderXScale = cacheScaleX * ownScaleX * stage.rendererScale;
        renderYScale = cacheScaleY * ownScaleY * stage.rendererScale;
    } else {
        renderXScale = Math.sqrt(
            tMatrix[0] * tMatrix[0]
            + tMatrix[1] * tMatrix[1]
        );
        renderYScale = Math.sqrt(
            tMatrix[2] * tMatrix[2]
            + tMatrix[3] * tMatrix[3]
        );
    }

    const xScaleRounded = Math.round(renderXScale * 100) / 100;
    const yScaleRounded = Math.round(renderYScale * 100) / 100;

    if (cacheMatrix && text_field.cacheKey
        && text_field.cacheParams[0] === xScaleRounded
        && text_field.cacheParams[1] === yScaleRounded
    ) {
        // cacheAsBitmap: スケール未変更のためキャッシュキーを維持
    } else if (text_field.changed
        && !text_field.cacheKey
        || text_field.cacheParams[0] !== xScaleRounded
        || text_field.cacheParams[1] !== yScaleRounded
        || text_field.cacheParams[2] !== tColorTransform[7]
    ) {
        text_field.cacheKey = $cacheStore.generateKeys(xScaleRounded, yScaleRounded, tColorTransform[7]);
        text_field.cacheParams[0] = xScaleRounded;
        text_field.cacheParams[1] = yScaleRounded;
        text_field.cacheParams[2] = tColorTransform[7];
    }

    const cacheKey = text_field.cacheKey;

    // rennder on
    renderQueue.pushTextFieldBuffer(
        1, $RENDERER_TEXT_TYPE,
        tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], tMatrix[4], tMatrix[5],
        tColorTransform[0], tColorTransform[1], tColorTransform[2], tColorTransform[3],
        tColorTransform[4], tColorTransform[5], tColorTransform[6], tColorTransform[7],
        xMin, yMin, xMax, yMax,
        text_field.xMin, text_field.yMin,
        text_field.xMax, text_field.yMax,
        +text_field.uniqueKey, cacheKey, +text_field.changed | (cacheMatrix ? 2 : 0),
        renderXScale, renderYScale,
        text_field.instanceId // フィルターキャッシュ用のユニークキー
    );

    if (text_field.$cache && !text_field.$cache.has(text_field.uniqueKey)) {
        text_field.$cache = null;
    }

    const cache = text_field.$cache
        ? text_field.$cache.get(`${cacheKey}`)
        : $cacheStore.get(text_field.uniqueKey, `${cacheKey}`);

    if (!cache || text_field.changed) {

        // cache none
        renderQueue.push(0, +cache);

        const buffer = $textEncoder.encode(JSON.stringify(text_field.$textData));

        renderQueue.push(buffer.length);
        renderQueue.set(buffer);

        // text setting
        switch (text_field.autoSize) {

            case "center":
                renderQueue.push(0);
                break;

            case "left":
                renderQueue.push(1);
                break;

            case "none":
                renderQueue.push(2);
                break;

            case "right":
                renderQueue.push(3);
                break;

        }

        renderQueue.push(
            text_field.stopIndex,
            text_field.scrollX,
            text_field.scrollY,
            text_field.textWidth,
            text_field.textHeight,
            Math.abs(text_field.xMax - text_field.xMin),
            Math.abs(text_field.yMax - text_field.yMin),
            text_field.focusIndex,
            text_field.selectIndex,
            +text_field.focusVisible,
            text_field.thickness,
            text_field.thicknessColor,
            +text_field.wordWrap,
            +text_field.border,
            text_field.borderColor,
            +text_field.background,
            text_field.backgroundColor,
            text_field.defaultTextFormat.color || 0,
            text_field.defaultTextFormat.size || 0
        );

        if (!cache) {
            $cacheStore.set(text_field.uniqueKey, `${cacheKey}`, true);
        }

        if (text_field.$cache) {
            text_field.$cache = null;
        }
    } else {
        if (!text_field.$cache) {
            text_field.$cache = $cacheStore.getById(text_field.uniqueKey);
            text_field.$cache.set(text_field.uniqueKey, true);
        }
        renderQueue.push(1);
    }

    renderQueue.push(
        displayObjectBlendToNumberService(text_field.blendMode)
    );

    if (text_field.filters?.length) {

        let updated = false;
        const params = [];
        const bounds = $getBoundsArray(0, 0, 0, 0);
        for (let idx = 0; idx < text_field.filters.length; idx++) {

            const filter = text_field.filters[idx];
            if (!filter || !filter.canApplyFilter()) {
                continue;
            }

            // フィルターが更新されたかをチェック
            if (filter.$updated) {
                updated = true;
            }
            filter.$updated = false;

            filter.getBounds(bounds);

            const buffer = filter.toNumberArray();

            for (let idx = 0; idx < buffer.length; idx += 4096) {
                params.push(...buffer.subarray(idx, idx + 4096));
            }
        }

        const useFilfer = params.length > 0;
        if (useFilfer) {
            renderQueue.push(
                +useFilfer, +updated,
                bounds[0], bounds[1], bounds[2], bounds[3],
                params.length
            );
            renderQueue.set(new Float32Array(params));
        } else {
            renderQueue.push(0);
        }

        $poolBoundsArray(bounds);
    } else {
        renderQueue.push(0);
    }

    if (tColorTransform !== color_transform) {
        ColorTransform.release(tColorTransform);
    }
    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }
};