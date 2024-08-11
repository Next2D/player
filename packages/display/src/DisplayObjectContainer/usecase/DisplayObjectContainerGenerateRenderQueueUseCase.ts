import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { ColorTransform } from "@next2d/geom";
import { execute as displayObjectGetRawColorTransformUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawColorTransformUseCase";
import { $clamp } from "../../DisplayObjectUtil";

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

    let multiColor: Float32Array = color_transform;
    const rawColor = displayObjectGetRawColorTransformUseCase(display_object_container);
    if (rawColor) {
        multiColor = ColorTransform.multiply(color_transform, rawColor);
    }
    
    const alpha: number = $clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
    if (!alpha) {
        return ;
    }

    const children = display_object_container.children;
    for (let idx = 0; idx < children.length; ++idx) {
        const child = children[idx] as DisplayObject;

        switch (true) {

            case child.isContainerEnabled:
                execute(
                    child as DisplayObjectContainer, 
                    render_queue,
                    matrix,
                    multiColor
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
        console.log(child);
    }

    if (multiColor === color_transform) {
        ColorTransform.release(multiColor);
    }

};