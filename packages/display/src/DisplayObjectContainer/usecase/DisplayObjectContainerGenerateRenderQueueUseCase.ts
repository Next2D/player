import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { $clamp } from "../../DisplayObjectUtil";
import {
    ColorTransform,
    Matrix
} from "@next2d/geom";

/**
 * @description renderer workerに渡す描画データを生成
 *              Generate drawing data to pass to the renderer worker
 * 
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {array} render_queue
 * @param  {Float32Array} matrix
 * @param  {Float32Array} color_transform
 * @return {void}
 * @method
 * @private
 */
export const execute = <P extends DisplayObjectContainer>(
    display_object_container: P,
    render_queue: number[],
    matrix: Float32Array,
    color_transform: Float32Array
): void => {

    if (!display_object_container.visible) {
        return ;
    }

     // transformed ColorTransform(tColorTransform)
    const rawColor = displayObjectGetRawColorTransformUseCase(display_object_container);
    const tColorTransform = rawColor 
        ? ColorTransform.multiply(color_transform, rawColor)
        : color_transform;
    
    const alpha: number = $clamp(tColorTransform[3] + tColorTransform[7] / 255, 0, 1, 0);
    if (!alpha) {
        return ;
    }

    const children = display_object_container.children;
    if (!children.length) {
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
        if (tColorTransform === color_transform) {
            ColorTransform.release(tColorTransform);
        }
        if (tMatrix === matrix) {
            Matrix.release(tMatrix);
        }
        return ;
    }

    const filters = display_object_container.filters;
    const blendMode = display_object_container.blendMode;
    if ((filters && filters.length > 0) || blendMode !== "normal") {
        // todo
    }

    // clipping check

    for (let idx = 0; idx < children.length; ++idx) {

        const child = children[idx] as DisplayObject;

        switch (true) {

            case child.isContainerEnabled:
                execute(
                    child as DisplayObjectContainer, 
                    render_queue,
                    tMatrix,
                    tColorTransform
                );
                break;

            case child.isShape:
                break;

            case child.isText:
                break;

            case child.isVideo:
                break;

            default:
                break;

        }
        // console.log(child);
    }

    if (tColorTransform === color_transform) {
        ColorTransform.release(tColorTransform);
    }
    if (tMatrix === matrix) {
        Matrix.release(tMatrix);
    }
};