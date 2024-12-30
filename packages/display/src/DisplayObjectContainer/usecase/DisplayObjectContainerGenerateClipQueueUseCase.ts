import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Matrix } from "@next2d/geom";
import { renderQueue } from "@next2d/render-queue";
import { $RENDERER_CONTAINER_TYPE } from "../../DisplayObjectUtil";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as shapeGenerateClipQueueUseCase } from "../../Shape/usecase/ShapeGenerateClipQueueUseCase";

/**
 * @description renderer workerに渡すDisplayObjectContainerのマスク描画データを生成
 *              Generate mask drawing data of DisplayObjectContainer to pass to renderer
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {number[]} render_queue
 * @param  {Float32Array} matrix
 * @return {void}
 * @method
 * @protected
 */
export const execute = <P extends DisplayObjectContainer>(
    display_object_container: P,
    matrix: Float32Array
): void => {

    // transformed matrix(tMatrix)
    const rawMatrix = displayObjectGetRawMatrixUseCase(display_object_container);
    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    const children = display_object_container.children;
    renderQueue.push($RENDERER_CONTAINER_TYPE, children.length);

    for (let idx = 0; idx < children.length; idx++) {

        const child = children[idx];
        if (!child) {
            continue;
        }

        // mask instance
        if (child.isMask) {
            continue;
        }

        switch (true) {

            case child.isContainerEnabled:
                execute(child, tMatrix);
                break;

            case child.isShape:
                shapeGenerateClipQueueUseCase(child, tMatrix);
                break;

            case child.isText:
                // todo
                break;

            case child.isVideo:
                // todo
                break;

        }
    }

    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }
};