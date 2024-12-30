import type { Video } from "@next2d/media";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as displayObjectBlendToNumberService } from "../../DisplayObject/service/DisplayObjectBlendToNumberService";
import { $cacheStore } from "@next2d/cache";
import { renderQueue } from "@next2d/render-queue";
import {
    $clamp,
    $RENDERER_VIDEO_TYPE,
    $getArray,
    $poolBoundsArray,
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
    bitmaps: Array<Promise<ImageBitmap>>,
    matrix: Float32Array,
    color_transform: Float32Array,
    renderer_width: number,
    renderer_height: number,
    point_x: number,
    point_y: number
): void => {

    if (!video.visible || !video.$videoElement || !video.loaded) {
        renderQueue.push(0);
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
        renderQueue.push(0);
        return ;
    }

    // transformed matrix(tMatrix)
    const rawMatrix = displayObjectGetRawMatrixUseCase(video);
    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    // draw text
    const bounds = displayObjectCalcBoundsMatrixService(
        0, 0, video.videoWidth, video.videoHeight,
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

        renderQueue.push(0);
        return;
    }

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

    // rennder on
    renderQueue.push(
        1, $RENDERER_VIDEO_TYPE,
        tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], tMatrix[4], tMatrix[5],
        tColorTransform[0], tColorTransform[1], tColorTransform[2], tColorTransform[3],
        tColorTransform[4], tColorTransform[5], tColorTransform[6], tColorTransform[7],
        0, 0, video.videoWidth, video.videoHeight,
        +video.uniqueKey
    );

    const cache = $cacheStore.get(video.uniqueKey, "0");
    if (cache || video.changed) {

        // cache none
        renderQueue.push(0, +cache);

        bitmaps.push(createImageBitmap(video.$videoElement, {
            "imageOrientation": "flipY"
        }));

        if (!cache) {
            $cacheStore.set(video.uniqueKey, "0", true);
        }
    } else {
        renderQueue.push(1);
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

    renderQueue.push(
        displayObjectBlendToNumberService(video.blendMode)
    );

    const useFilfer = params.length > 0;
    renderQueue.push(+useFilfer);
    if (useFilfer) {
        renderQueue.push(params.length, ...params);
    }

    if (tColorTransform !== color_transform) {
        ColorTransform.release(tColorTransform);
    }
    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }
};