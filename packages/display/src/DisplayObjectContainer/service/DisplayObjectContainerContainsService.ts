import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";

/**
 * @description DisplayObjectContainer とその子孫が指定の DisplayObject を含むかどうか
 *              Whether DisplayObjectContainer and its descendants contain the specified DisplayObject
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {DisplayObject} display_object
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer, D extends DisplayObject>(
    display_object_container: C,
    display_object: D
): boolean => {

    if (display_object_container.instanceId === display_object.instanceId) {
        return true;
    }

    const children = display_object_container.children;
    for (let idx = 0; idx < children.length; ++idx) {

        const child = children[idx];
        if (!child) {
            continue;
        }

        if (child.instanceId === display_object.instanceId) {
            return true;
        }

        if (!child.isContainerEnabled) {
            continue;
        }

        if ((child as DisplayObjectContainer).contains(display_object)) {
            return true;
        }
    }

    return false;
};