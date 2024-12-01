import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { Shape } from "../../Shape";
import type { TextField } from "@next2d/text";
import type { Video } from "@next2d/media";
import { $COLOR_ARRAY_IDENTITY } from "../../Stage";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as shapeGenerateRenderQueueUseCase } from "../../Shape/usecase/ShapeGenerateRenderQueueUseCase";
import { execute as shapeGenerateClipQueueUseCase } from "../../Shape/usecase/ShapeGenerateClipQueueUseCase";
import { execute as textFieldGenerateRenderQueueUseCase } from "../../TextField/usecase/TextFieldGenerateRenderQueueUseCase";
import { execute as videoGenerateRenderQueueUseCase } from "../../Video/usecase/VideoGenerateRenderQueueUseCase";
import { execute as displayObjectIsMaskReflectedInDisplayUseCase } from "../../DisplayObject/usecase/DisplayObjectIsMaskReflectedInDisplayUseCase";
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
 * @param  {array} render_queue
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
    render_queue: number[],
    bitmaps: Array<Promise<ImageBitmap>>,
    matrix: Float32Array,
    color_transform: Float32Array,
    renderer_width: number,
    renderer_height: number,
    point_x: number,
    point_y: number
): void => {

    if (!display_object_container.visible) {
        render_queue.push(0);
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
        render_queue.push(0);
        return ;
    }

    const children = display_object_container.children;
    if (!children.length) {
        if (tColorTransform !== color_transform) {
            ColorTransform.release(tColorTransform);
        }
        render_queue.push(0);
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
        render_queue.push(0);
        return ;
    }

    render_queue.push(1);
    render_queue.push($RENDERER_CONTAINER_TYPE);

    const filters = display_object_container.filters;
    const blendMode = display_object_container.blendMode;

    let isLayer = false;
    if (filters && filters.length > 0 || blendMode !== "normal") {
        isLayer = true;
        // todo
    }

    // mask
    const maskInstance = display_object_container.mask;
    if (maskInstance) {

        const bounds = displayObjectIsMaskReflectedInDisplayUseCase(
            maskInstance,
            tMatrix,
            renderer_width,
            renderer_height,
            point_x,
            point_y
        );

        if (!bounds) {
            maskInstance.changed = false;
            render_queue.push(0);
        } else {

            render_queue.push(1);

            // マスクの描画範囲
            render_queue.push(...bounds);

            switch (true) {

                case maskInstance.isContainerEnabled: // 0x00
                    break;

                case maskInstance.isShape: // 0x01
                    shapeGenerateClipQueueUseCase(
                        maskInstance as Shape,
                        render_queue,
                        tMatrix
                    );
                    break;

                case maskInstance.isText: // 0x02
                    break;

                case maskInstance.isVideo: // 0x03
                    break;

                default:
                    break;
            }
        }

    } else {
        render_queue.push(0);
    }

    const colorTransform = isLayer
        ? $COLOR_ARRAY_IDENTITY
        : tColorTransform;

    render_queue.push(children.length);

    let clipDepth = 0;
    let canRenderMask = true;
    for (let idx = 0; idx < children.length; ++idx) {

        const child = children[idx] as DisplayObject;
        if (child.isMask) {
            continue;
        }

        render_queue.push(child.placeId, child.clipDepth);
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
            render_queue.push(+canRenderMask);

            if (!bounds) {
                child.changed = false;
                continue;
            }

            render_queue.push(...bounds);
            switch (true) {

                case child.isContainerEnabled: // 0x00
                    break;

                case child.isShape: // 0x01
                    shapeGenerateClipQueueUseCase(
                        child as Shape,
                        render_queue,
                        tMatrix
                    );
                    break;

                case child.isText: // 0x02
                    break;

                case child.isVideo: // 0x03
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
                    render_queue,
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
                    render_queue,
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
                    render_queue,
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
                    render_queue,
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