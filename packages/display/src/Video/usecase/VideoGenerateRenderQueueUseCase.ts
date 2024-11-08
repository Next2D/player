import type { Video } from "@next2d/media";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as displayObjectBlendToNumberService } from "../../DisplayObject/service/DisplayObjectBlendToNumberService";
import { execute as videoGetRawBoundsService } from "../service/VideoGetRawBoundsService";
import { $cacheStore } from "@next2d/cache";
import {
    $clamp,
    $RENDERER_VIDEO_TYPE,
    $getArray,
    $poolArray
} from "../../DisplayObjectUtil";
import {
    ColorTransform,
    Matrix
} from "@next2d/geom";

/**
 * @description renderer workerに渡すVideoの描画データを生成
 *              Generate drawing data of Video to pass to renderer
 *
 * @param  {Video} video
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
    video: Video,
    render_queue: number[],
    bitmaps: Array<Promise<ImageBitmap>>,
    matrix: Float32Array,
    color_transform: Float32Array,
    renderer_width: number,
    renderer_height: number,
    point_x: number,
    point_y: number
): void => {

    if (!video.visible || !video.$videoElement || !video.loaded) {
        render_queue.push(0);
        return ;
    }

    // transformed ColorTransform(tColorTransform)
    const rawColor = displayObjectGetRawColorTransformUseCase(video);
    const tColorTransform = rawColor
        ? ColorTransform.multiply(color_transform, rawColor)
        : color_transform;

    const alpha = $clamp(tColorTransform[3] + tColorTransform[7] / 255, 0, 1, 0);
    if (!alpha) {
        if (tColorTransform !== color_transform) {
            ColorTransform.release(tColorTransform);
        }
        render_queue.push(0);
        return ;
    }

    // transformed matrix(tMatrix)
    const rawMatrix = displayObjectGetRawMatrixUseCase(video);
    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    // draw text
    const rawBounds = videoGetRawBoundsService(video);
    const bounds = displayObjectCalcBoundsMatrixService(
        rawBounds[0], rawBounds[1],
        rawBounds[2], rawBounds[3],
        tMatrix
    );

    const xMin = bounds[0];
    const yMin = bounds[1];
    const xMax = bounds[2];
    const yMax = bounds[3];
    $poolArray(bounds);

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
    render_queue.push($RENDERER_VIDEO_TYPE);
    render_queue.push(...tMatrix, ...tColorTransform);

    // base bounds
    render_queue.push(...rawBounds);
    $poolArray(rawBounds);

    if (!video.uniqueKey) {
        if (video.characterId && video.loaderInfo) {

            const values = $getArray(
                video.loaderInfo.id,
                video.characterId
            );

            let hash = 0;
            for (let idx = 0; idx < values.length; idx++) {
                hash = (hash << 5) - hash + values[idx];
                hash |= 0;
            }

            $poolArray(values);
            video.uniqueKey = `${hash}`;

        } else {

            video.uniqueKey = `${video.instanceId}`;

        }
    }

    render_queue.push(+video.uniqueKey);

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

    const cache = $cacheStore.get(video.uniqueKey, "0");
    if (cache || video.changed) {

        // cache none
        render_queue.push(0);

        // has cache
        render_queue.push(+cache);

        bitmaps.push(createImageBitmap(video.$videoElement, {
            "imageOrientation": "flipY"
        }));

        if (!cache) {
            $cacheStore.set(video.uniqueKey, "0", true);
        }
    } else {
        render_queue.push(1);
    }

    const params  = [];
    if (video.filters?.length) {
        for (let idx = 0; idx < video.filters.length; idx++) {
            const filter = video.filters[idx];
            if (!filter || !filter.canApplyFilter()) {
                continue;
            }

            params.push(...filter.toNumberArray());
        }
    }

    render_queue.push(
        displayObjectBlendToNumberService(video.blendMode)
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