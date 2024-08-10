import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import {
    $rootMap,
    $stageAssignedMap
} from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectContainer の子要素に root と stage を設定
 *              Set root and stage for child elements of DisplayObjectContainer
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @return {void}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer>(
    display_object_container: C
): void => {

    const children = display_object_container.children;
    for (let idx = 0; idx < children.length; ++idx) {

        const child = children[idx];
        if (!child) {
            continue;
        }

        // set root and stage
        $rootMap.set(child, display_object_container.root);
        $stageAssignedMap.add(child);

        if (!child.isContainerEnabled) {
            continue;
        }

        execute(child as DisplayObjectContainer);
    }
}