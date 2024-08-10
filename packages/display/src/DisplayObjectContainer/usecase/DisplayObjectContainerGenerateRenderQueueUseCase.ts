import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";

/**
 * @description renderer workerに渡す描画データを生成
 *              Generate drawing data to pass to the renderer worker
 * 
 * @param  {array} render_queue
 * @param  {Float32Array} matrix
 * @return {void}
 * @method
 * @private
 */
export const execute = <P extends DisplayObjectContainer>(
    display_object_container: P,
    render_queue: number[],
    matrix: Float32Array
): void => {

    if (!display_object_container.visible) {
        return ;
    }

    const children = display_object_container.children;
    for (let idx = 0; idx < children.length; ++idx) {
        const child = children[idx] as DisplayObject;

        switch (true) {

            case child.isContainerEnabled:
                execute(child as DisplayObjectContainer, render_queue, matrix);
                break;
            
            default:
                break;

        }
        console.log(child);
    }

};