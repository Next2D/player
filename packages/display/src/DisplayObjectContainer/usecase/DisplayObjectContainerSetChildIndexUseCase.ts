import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as displayObjectApplyChangesService } from "../../DisplayObject/service/DisplayObjectApplyChangesService";

/**
 * @description 指定されたインデックスに子を移動します
 *              Moves the child to the specified index
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {DisplayObject} display_object
 * @param  {number} index
 * @return {void}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer, D extends DisplayObject>(
    display_object_container: C,
    display_object: D,
    index: number
): void => {

    const currentIndex = display_object_container.getChildIndex(display_object);
    if (currentIndex === -1 || currentIndex === index) {
        return ;
    }

    const children = display_object_container.children;
    children.splice(currentIndex, 1);
    children.splice(index, 0, display_object);

    displayObjectApplyChangesService(display_object_container);
};