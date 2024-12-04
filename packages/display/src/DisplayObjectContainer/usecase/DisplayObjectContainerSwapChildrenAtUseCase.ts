import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as displayObjectApplyChangesService } from "../../DisplayObject/service/DisplayObjectApplyChangesService";

/**
 * @description 子リスト内の指定されたインデックス位置に該当する 2 つの子オブジェクトの z 順序（重ね順）を入れ替えます。
 *              Swaps the z-order (front-to-back order) of the child objects at
 *              the two specified index positions in the child list.
 * @param {DisplayObjectContainer} display_object_container
 * @param {number} index1
 * @param {number} index2
 * @return {void}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer>(
    display_object_container: C,
    index1: number,
    index2: number
): void => {

    const children = display_object_container.children;

    const displayObject1 = children[index1];
    const displayObject2 = children[index2];

    if (!displayObject1 || !displayObject2) {
        return ;
    }

    children[index1] = displayObject2;
    children[index2] = displayObject1;

    displayObjectApplyChangesService(display_object_container);
};