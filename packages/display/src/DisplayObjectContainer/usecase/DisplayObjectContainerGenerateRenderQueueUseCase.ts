import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { Shape } from "../../Shape";
import type { TextField } from "@next2d/text";
import type { Video } from "@next2d/media";
import { renderQueue } from "@next2d/render-queue";
import { $COLOR_ARRAY_IDENTITY } from "../../Stage";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as shapeGenerateRenderQueueUseCase } from "../../Shape/usecase/ShapeGenerateRenderQueueUseCase";
import { execute as shapeGenerateClipQueueUseCase } from "../../Shape/usecase/ShapeGenerateClipQueueUseCase";
import { execute as textFieldGenerateRenderQueueUseCase } from "../../TextField/usecase/TextFieldGenerateRenderQueueUseCase";
import { execute as videoGenerateRenderQueueUseCase } from "../../Video/usecase/VideoGenerateRenderQueueUseCase";
import { execute as displayObjectIsMaskReflectedInDisplayUseCase } from "../../DisplayObject/usecase/DisplayObjectIsMaskReflectedInDisplayUseCase";
import { execute as displayObjectContainerGenerateClipQueueUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerGenerateClipQueueUseCase";
import {
    $clamp,
    $RENDERER_CONTAINER_TYPE
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
 * @param  {Float32Array} matrix
 * @param  {Float32Array} color_transform
 * @param  {number} renderer_width
 * @param  {number} renderer_height
 * @param  {number} point_x
 * @param  {number} point_y
 * @return {void}
 * @method
 * @private
 */
export const execute = <P extends DisplayObjectContainer>(
    display_object_container: P,
    bitmaps: Array<Promise<ImageBitmap>>,
    matrix: Float32Array,
    color_transform: Float32Array,
    renderer_width: number,
    renderer_height: number,
    point_x: number,
    point_y: number
): void => {

    if (!display_object_container.visible) {
        renderQueue.push(0);
        return ;
    }

    // transformed ColorTransform(tColorTransform)
    const rawColor = displayObjectGetRawColorTransformUseCase(display_object_container);
    const tColorTransform = rawColor
        ? ColorTransform.multiply(color_transform, rawColor)
        : color_transform;

    const alpha: number = $clamp(tColorTransform[3] + tColorTransform[7] / 255, 0, 1, 0);
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
    const tMatrix = rawMatrix
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

    const filters = display_object_container.filters;
    const blendMode = display_object_container.blendMode;

    let isLayer = false;
    if (filters && filters.length > 0 || blendMode !== "normal") {
        isLayer = true;
        // todo
    }

    // mask
    const maskDisplayObject = display_object_container.mask;
    if (maskDisplayObject) {

        const bounds = displayObjectIsMaskReflectedInDisplayUseCase(
            maskDisplayObject,
            tMatrix,
            renderer_width,
            renderer_height,
            point_x,
            point_y
        );

        if (!bounds) {
            maskDisplayObject.changed = false;
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

                case maskDisplayObject.isText: // 0x02
                    // todo
                    break;

                case maskDisplayObject.isVideo: // 0x03
                    // todo
                    break;

                default:
                    break;
            }
        }

    } else {
        renderQueue.push(0);
    }

    const colorTransform = isLayer
        ? $COLOR_ARRAY_IDENTITY
        : tColorTransform;

    renderQueue.push(children.length);

    let clipDepth = 0;
    let canRenderMask = true;
    for (let idx = 0; idx < children.length; ++idx) {

        const child = children[idx] as DisplayObject;
        if (child.isMask) {
            continue;
        }

        renderQueue.push(child.placeId, child.clipDepth);
        if (clipDepth && child.placeId > clipDepth) {
            clipDepth = 0;
            canRenderMask = true;
        }

        if (!canRenderMask) {
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
                renderer_height,
                point_x,
                point_y
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

                case child.isText: // 0x02
                    // todo
                    console.log("mask text");
                    break;

                case child.isVideo: // 0x03
                    // todo
                    console.log("mask video");
                    break;

                default:
                    break;
            }

            continue;
        }

        switch (true) {

            case child.isContainerEnabled: // 0x00
                execute(
                    child as DisplayObjectContainer,
                    bitmaps,
                    tMatrix,
                    colorTransform,
                    renderer_width,
                    renderer_height,
                    point_x,
                    point_y
                );
                break;

            case child.isShape: // 0x01
                shapeGenerateRenderQueueUseCase(
                    child as Shape,
                    tMatrix,
                    colorTransform,
                    renderer_width,
                    renderer_height,
                    point_x,
                    point_y
                );
                break;

            case child.isText: // 0x02
                textFieldGenerateRenderQueueUseCase(
                    child as TextField,
                    tMatrix,
                    colorTransform,
                    renderer_width,
                    renderer_height,
                    point_x,
                    point_y
                );
                break;

            case child.isVideo: // 0x03
                videoGenerateRenderQueueUseCase(
                    child as Video,
                    bitmaps,
                    tMatrix,
                    colorTransform,
                    renderer_width,
                    renderer_height,
                    point_x,
                    point_y
                );
                break;

            default:
                break;

        }

        child.changed = false;
    }

    if (!isLayer && tColorTransform !== color_transform) {
        ColorTransform.release(tColorTransform);
    }
    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }
};