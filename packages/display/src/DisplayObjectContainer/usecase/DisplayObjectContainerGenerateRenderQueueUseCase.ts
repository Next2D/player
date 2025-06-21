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
import { renderQueue } from "@next2d/render-queue";
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