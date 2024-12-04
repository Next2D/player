import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as displayObjectApplyChangesService } from "../../DisplayObject/service/DisplayObjectApplyChangesService";

/**
 * @description 指定された2つの子の表示順を入れ替えます
 *              Swaps the display order of the two specified children
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {DisplayObject} display_object1
 * @param  {DisplayObject} display_object2
 * @return {void}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer, D extends DisplayObject>(
    display_object_container: C,
    display_object1: D,
    display_object2: D
): void => {

    const index1 = display_object_container.getChildIndex(display_object1);
    const index2 = display_object_container.getChildIndex(display_object2);

    if (index1 === -1 || index2 === -1) {
        return ;
    }

    const children = display_object_container.children;
    children[index1] = display_object2;
    children[index2] = display_object1;

    displayObjectApplyChangesService(display_object_container);
};