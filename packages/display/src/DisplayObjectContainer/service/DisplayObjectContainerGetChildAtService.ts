import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";

/**
 * @description DisplayObjectContainer の指定indexの子要素を取得
 *              Get the child element of DisplayObjectContainer at the specified index
 *
 * @param {DisplayObjectContainer} display_object_container
 * @param {number} index
 * @return {DisplayObject | null}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer, D extends DisplayObject> (
    display_object_container: C,
    index: number
): D | null => {
    const children = display_object_container.children;
    return index in children ? children[index] : null;
};