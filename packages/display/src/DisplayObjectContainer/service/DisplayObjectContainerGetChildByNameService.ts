import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";

/**
 * @description 指定した名前の子要素を取得します
 *              Gets the child element with the specified name.
 *
 * @param {DisplayObjectContainer} display_object_container
 * @param {string} name
 * @return {DisplayObject | null}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer, D extends DisplayObject>(
    display_object_container: C,
    name: string
): D | null => {

    if (!name) {
        return null;
    }

    const children = display_object_container.children;
    for (let idx = 0; idx < children.length; ++idx) {

        const child = children[idx];
        if (!child.name || child.name !== name) {
            continue;
        }

        return child;
    }

    return null;
};