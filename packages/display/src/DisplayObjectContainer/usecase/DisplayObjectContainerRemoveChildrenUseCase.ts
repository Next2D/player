import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as displayObjectContainerRemoveChildUseCase } from "./DisplayObjectContainerRemoveChildUseCase";

/**
 * @description 配列で指定されたインデックスの子をコンテナから削除します
 *              Removes children of the index specified in the array from the container
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {number[]} indexes
 * @return {void}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer>(
    display_object_container: C,
    indexes: number[]
): void => {

    const children = display_object_container.children.slice();
    if (!children.length) {
        return ;
    }

    for (let idx = 0; idx < indexes.length; idx++) {

        const index = indexes[idx];

        const child = children[index];
        if (!child) {
            continue;
        }

        displayObjectContainerRemoveChildUseCase(
            display_object_container, child
        );
    }
};