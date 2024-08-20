import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { Shape } from "../../Shape";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as shapeGenerateRenderQueueUseCase } from "../../Shape/usecase/ShapeGenerateRenderQueueUseCase";
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
    matrix: Float32Array,
    color_transform: Float32Array,
    renderer_width: number,
    renderer_height: number,
    point_x: number,
    point_y: number
): void => {

    render_queue.push($RENDERER_CONTAINER_TYPE);
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

    const filters = display_object_container.filters;
    const blendMode = display_object_container.blendMode;

    let rendererWidth  = renderer_width;
    let rendererHeight = renderer_height;
    let isLayer = false;
    if ((filters && filters.length > 0) || blendMode !== "normal") {
        isLayer = true;
        // todo
    }

    // 
    render_queue.push(1);

    const colorTransform = isLayer 
        ? tColorTransform
        : new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

    const changed = display_object_container.changed;
    render_queue.push(children.length);
    for (let idx = 0; idx < children.length; ++idx) {

        const child = children[idx] as DisplayObject;
        if (changed) {
            child.placeObject = null;
        }

        render_queue.push(child.placeId, child.clipDepth);
        switch (true) {

            case child.isContainerEnabled: // 0x00
                execute(
                    child as DisplayObjectContainer, 
                    render_queue,
                    tMatrix,
                    colorTransform,
                    rendererWidth,
                    rendererHeight,
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
                    rendererWidth,
                    rendererHeight,
                    point_x,
                    point_y
                );
                break;

            case child.isText: // 0x02
                break;

            case child.isVideo: // 0x03
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