import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { Shape } from "../../Shape";
import type { TextField } from "@next2d/text";
import type { Video } from "@next2d/media";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as shapeGenerateRenderQueueUseCase } from "../../Shape/usecase/ShapeGenerateRenderQueueUseCase";
import { execute as shapeGenerateClipQueueUseCase } from "../../Shape/usecase/ShapeGenerateClipQueueUseCase";
import { execute as textFieldGenerateRenderQueueUseCase } from "../../TextField/usecase/TextFieldGenerateRenderQueueUseCase";
import { execute as videoGenerateRenderQueueUseCase } from "../../Video/usecase/VideoGenerateRenderQueueUseCase";
import { execute as displayObjectIsMaskReflectedInDisplayUseCase } from "../../DisplayObject/usecase/DisplayObjectIsMaskReflectedInDisplayUseCase";
import { execute as displayObjectContainerGenerateClipQueueUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerGenerateClipQueueUseCase";
import { execute as displayObjectBlendToNumberService } from "../../DisplayObject/service/DisplayObjectBlendToNumberService";
import { execute as displayObjectContainerGetLayerBoundsUseCase } from "./DisplayObjectContainerGetLayerBoundsUseCase";
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { execute as displayObjectContainerCalcBoundsMatrixUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerCalcBoundsMatrixUseCase";
import { renderQueue } from "@next2d/render-queue";
import { $cacheStore } from "@next2d/cache";
import {
    $clamp,
    $getBoundsArray,
    $poolBoundsArray,
    $RENDERER_CONTAINER_TYPE,
    $getFloat32Array8,
    $getFloat32Array6
} from "../../DisplayObjectUtil";
import {
    ColorTransform,
    Matrix
} from "@next2d/geom";

/**
 * @description renderer workerに渡すコンテナの描画データを生成
 *              Generate rendering data of the container to be passed to the renderer worker
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {ImageBitmap[]} image_bitmaps
 * @param  {Float32Array} matrix
 * @param  {Float32Array} color_transform
 * @param  {number} renderer_width
 * @param  {number} renderer_height
 * @return {void}
 * @method
 * @private
 */
export const execute = <P extends DisplayObjectContainer>(
    display_object_container: P,
    image_bitmaps: ImageBitmap[],
    matrix: Float32Array,
    color_transform: Float32Array,
    renderer_width: number,
    renderer_height: number
): void => {

    if (!display_object_container.visible) {
        renderQueue.push(0);
        return ;
    }

    // transformed ColorTransform(tColorTransform)
    const rawColor = displayObjectGetRawColorTransformUseCase(display_object_container);
    let tColorTransform = rawColor
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

    const children = display_object_container.children;
    if (!children.length) {
        if (tColorTransform !== color_transform) {
            ColorTransform.release(tColorTransform);
        }
        renderQueue.push(0);
        return ;
    }

    // transformed matrix(tMatrix)
    const rawMatrix = displayObjectGetRawMatrixUseCase(display_object_container);
    let tMatrix = rawMatrix
        && (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
        || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
        || rawMatrix[4] !== 0 || rawMatrix[5] !== 0)
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    // size zero
    if (!tMatrix[0] && !tMatrix[1]
        || !tMatrix[2] && !tMatrix[3]
    ) {
        if (tColorTransform !== color_transform) {
            ColorTransform.release(tColorTransform);
        }
        if (tMatrix !== matrix) {
            Matrix.release(tMatrix);
        }
        renderQueue.push(0);
        return ;
    }

    renderQueue.push(1, $RENDERER_CONTAINER_TYPE);

    // blendMode
    const blendMode = display_object_container.blendMode;
    renderQueue.push(displayObjectBlendToNumberService(blendMode));

    // filters
    const filters = display_object_container.filters;
    if (filters) {
        const filterKey = $cacheStore.generateFilterKeys(
            tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3]
        );
        let filterCache = $cacheStore.get(
            `${display_object_container.instanceId}`, 
            `${filterKey}`
        );

        let updated = false;
        const params = [];
        const bounds = $getBoundsArray(0, 0, 0, 0);
        for (let idx = 0; idx < filters.length; idx++) {

            const filter = filters[idx];
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

            // 子の変更があった場合は親のフラグが立っているので更新
            if (!updated) {
                updated = display_object_container.changed;
            }

            const baseLayerBounds = displayObjectContainerGetLayerBoundsUseCase(
                display_object_container
            );
            const layerBounds = displayObjectCalcBoundsMatrixService(
                baseLayerBounds[0], baseLayerBounds[1],
                baseLayerBounds[2], baseLayerBounds[3], tMatrix
            );

            if (filterCache) {

                // キャッシュがあって、変更がなければキャッシュを使用
                if (!updated) {
                    renderQueue.push(1,
                        Math.ceil(Math.abs(layerBounds[2] - layerBounds[0])),
                        Math.ceil(Math.abs(layerBounds[3] - layerBounds[1])),
                        1, 1, display_object_container.instanceId, filterKey,
                        tColorTransform[0], tColorTransform[1], tColorTransform[2], tColorTransform[3],
                        tColorTransform[4], tColorTransform[5], tColorTransform[6], tColorTransform[7]
                    );
                    return ;
                }
                
                // どこかで変更があったので、キャッシュを削除
                $cacheStore.removeById(`${display_object_container.instanceId}`);
            }

            renderQueue.push(
                1,
                Math.ceil(Math.abs(layerBounds[2] - layerBounds[0])),
                Math.ceil(Math.abs(layerBounds[3] - layerBounds[1])),
                1, 0, display_object_container.instanceId, filterKey,
                bounds[0], bounds[1], bounds[2], bounds[3],
                tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], tMatrix[4], tMatrix[5],
                tColorTransform[0], tColorTransform[1], tColorTransform[2], tColorTransform[3],
                tColorTransform[4], tColorTransform[5], tColorTransform[6], tColorTransform[7],
                params.length
            );
            renderQueue.set(new Float32Array(params));

            if (tMatrix !== matrix) {
                Matrix.release(tMatrix);
            }

            tMatrix = $getFloat32Array6(
                tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], 
                -layerBounds[4], -layerBounds[5]
            );

            if (tColorTransform !== color_transform) {
                ColorTransform.release(tColorTransform);
            }

            tColorTransform = $getFloat32Array8(1, 1, 1, 1, 0, 0, 0, 0);

            $poolBoundsArray(baseLayerBounds);
            $poolBoundsArray(layerBounds);

            $cacheStore.set(
                `${display_object_container.instanceId}`,
                `${filterKey}`, true
            );

        } else {
            if (blendMode === "normal") {
                renderQueue.push(0);
            } else {

                // ブレンドモードのみのLayerモード
                const layerBounds = displayObjectContainerCalcBoundsMatrixUseCase(
                    display_object_container,
                    tMatrix
                );

                renderQueue.push(
                    1, 
                    Math.ceil(Math.abs(layerBounds[2] - layerBounds[0])),
                    Math.ceil(Math.abs(layerBounds[3] - layerBounds[1])),
                    0, // not use filter,
                    tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], tMatrix[4], tMatrix[5]
                );
                $poolBoundsArray(layerBounds);

                if (tMatrix !== matrix) {
                    Matrix.release(tMatrix);
                }

                tMatrix = $getFloat32Array6(
                    tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], 
                    -tMatrix[4], -tMatrix[5]
                );
            }
        }

        $poolBoundsArray(bounds);
    } else {
        if (blendMode === "normal") {
            renderQueue.push(0);
        } else {
            const layerBounds = displayObjectContainerCalcBoundsMatrixUseCase(
                display_object_container,
                tMatrix
            );

            renderQueue.push(
                1, 
                Math.ceil(Math.abs(layerBounds[2] - layerBounds[0])),
                Math.ceil(Math.abs(layerBounds[3] - layerBounds[1])),
                0, // not use filter,
                tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], tMatrix[4], tMatrix[5],
                tColorTransform[0], tColorTransform[1], tColorTransform[2], tColorTransform[3],
                tColorTransform[4], tColorTransform[5], tColorTransform[6], tColorTransform[7]
            );
            $poolBoundsArray(layerBounds);

            if (tMatrix !== matrix) {
                Matrix.release(tMatrix);
            }

            tMatrix = $getFloat32Array6(
                tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3], 
                -tMatrix[4], -tMatrix[5]
            );
        }
    }

    // mask
    const maskDisplayObject = display_object_container.mask;
    if (maskDisplayObject) {

        const bounds = displayObjectIsMaskReflectedInDisplayUseCase(
            maskDisplayObject,
            tMatrix,
            renderer_width,
            renderer_height
        );

        if (!bounds) {
            renderQueue.push(0);
        } else {

            // マスクの描画範囲
            renderQueue.push(1, bounds[0], bounds[1], bounds[2], bounds[3]);

            switch (true) {

                case maskDisplayObject.isContainerEnabled: // 0x00
                    displayObjectContainerGenerateClipQueueUseCase(
                        maskDisplayObject as DisplayObjectContainer,
                        tMatrix
                    );
                    break;

                case maskDisplayObject.isShape: // 0x01
                    shapeGenerateClipQueueUseCase(
                        maskDisplayObject as Shape,
                        tMatrix
                    );
                    break;

                default:
                    break;
            }
        }

        maskDisplayObject.changed = false;
    } else {
        renderQueue.push(0);
    }

    // children
    renderQueue.push(children.length);

    let clipDepth = 0;
    let canRenderMask = true;
    for (let idx = 0; idx < children.length; ++idx) {

        const child = children[idx] as DisplayObject;

        renderQueue.push(child.placeId, child.clipDepth);

        // マスクオブジェクトは描画しない（hidden=0）
        if (child.isMask) {
            renderQueue.push(0);
            child.changed = false;
            continue;
        }

        if (clipDepth && child.placeId > clipDepth) {
            clipDepth = 0;
            canRenderMask = true;
        }

        if (!canRenderMask) {
            renderQueue.push(0);
            child.changed = false;
            continue;
        }

        if (child.clipDepth) {
            clipDepth = child.clipDepth;

            // マスクの描画開始判定
            const bounds = displayObjectIsMaskReflectedInDisplayUseCase(
                child,
                tMatrix,
                renderer_width,
                renderer_height
            );

            canRenderMask = bounds ? true : false;
            renderQueue.push(+canRenderMask);

            if (!bounds) {
                child.changed = false;
                continue;
            }

            renderQueue.push(bounds[0], bounds[1], bounds[2], bounds[3]);
            switch (true) {

                case child.isContainerEnabled: // 0x00
                    displayObjectContainerGenerateClipQueueUseCase(
                        child as DisplayObjectContainer,
                        tMatrix
                    );
                    break;

                case child.isShape: // 0x01
                    shapeGenerateClipQueueUseCase(
                        child as Shape,
                        tMatrix
                    );
                    break;

                default:
                    break;
            }

            child.changed = false;
            continue;
        }

        switch (true) {

            case child.isContainerEnabled: // 0x00
                execute(
                    child as DisplayObjectContainer,
                    image_bitmaps,
                    tMatrix,
                    tColorTransform,
                    renderer_width,
                    renderer_height
                );
                break;

            case child.isShape: // 0x01
                shapeGenerateRenderQueueUseCase(
                    child as Shape,
                    tMatrix,
                    tColorTransform,
                    renderer_width,
                    renderer_height
                );
                break;

            case child.isText: // 0x02
                textFieldGenerateRenderQueueUseCase(
                    child as TextField,
                    tMatrix,
                    tColorTransform,
                    renderer_width,
                    renderer_height
                );
                break;

            case child.isVideo: // 0x03
                videoGenerateRenderQueueUseCase(
                    child as Video,
                    image_bitmaps,
                    tMatrix,
                    tColorTransform,
                    renderer_width,
                    renderer_height
                );
                break;

            default:
                break;

        }

        child.changed = false;
    }

    if (tColorTransform !== color_transform) {
        ColorTransform.release(tColorTransform);
    }
    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }
};