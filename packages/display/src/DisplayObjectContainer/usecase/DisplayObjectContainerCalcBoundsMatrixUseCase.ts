import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { $getArray } from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectContainerのバウンディングボックスを計算
 *              Calculate the bounding box of the DisplayObjectContainer
 *
 * @param  {DisplayObjectContainer} display_object_container 
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer>(
    display_object_container: C,
    matrix: Float32Array | null = null
): number[] => {

    const children = display_object_container.children;
    if (!children.length) {
        return $getArray(0, 0, 0, 0);
    }

    return $getArray(0, 0, 0, 0);
};