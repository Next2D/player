import type { Video } from "@next2d/media";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as displayObjectBlendToNumberService } from "../../DisplayObject/service/DisplayObjectBlendToNumberService";
import { execute as displayObjectGenerateHashService } from "../../DisplayObject/service/DisplayObjectGenerateHashService";
import { $cacheStore } from "@next2d/cache";
import { renderQueue } from "@next2d/render-queue";
import {
    $clamp,
    $RENDERER_VIDEO_TYPE,
    $getArray,
    $poolBoundsArray,
    $poolArray,
    $getBoundsArray
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
 * @param  {ImageBitmap[]} image_bitmaps
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
    image_bitmaps: ImageBitmap[],
    matrix: Float32Array,
    color_transform: Float32Array,
    renderer_width: number,
    renderer_height: number,
    point_x: number,
    point_y: number
): void => {

    if (!video.visible
        || !video.$videoElement
        || !video.$offscreenCanvas
        || !video.loaded
    ) {
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

            video.uniqueKey = `${displayObjectGenerateHashService(new Float32Array(values))}`;
            $poolArray(values);

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
        xMin, yMin, xMax, yMax,
        0, 0, video.videoWidth, video.videoHeight,
        +video.uniqueKey, +video.changed
    );

    if (video.$cache && !video.$cache.has(video.uniqueKey)) {
        video.$cache = null;
    }

    const cache = video.$cache
        ? video.$cache.get("0")
        : $cacheStore.get(video.uniqueKey, "0");

    if (!cache || video.changed) {

        // cache, node
        renderQueue.push(0, +cache);

        const context = video.$context;
        if (context) {

            const x = video.videoWidth / 2;
            const y = video.videoHeight / 2;

            // 反転して転送
            context.save();
            context.translate(x, y);
            context.rotate(Math.PI);
            context.scale(-1, 1);
            context.drawImage(
                video.$videoElement, -x, -y,
                video.videoWidth, video.videoHeight
            );
            context.restore();

            image_bitmaps.push(
                video.$offscreenCanvas.transferToImageBitmap()
            );
        }

        if (!cache) {
            $cacheStore.set(video.uniqueKey, "0", true);
        }

        if (video.$cache) {
            video.$cache = null;
        }
    } else {
        if (!video.$cache) {
            video.$cache = $cacheStore.getById(video.uniqueKey);
            video.$cache.set(video.uniqueKey, true);
        }
        renderQueue.push(1);
    }

    renderQueue.push(
        displayObjectBlendToNumberService(video.blendMode)
    );

    if (video.filters?.length) {

        let updated = false;
        const params = [];
        const bounds = $getBoundsArray(0, 0, 0, 0);
        for (let idx = 0; idx < video.filters.length; idx++) {

            const filter = video.filters[idx];
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