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
export const execute = <P extends DisplayObjectContainer>(
    display_object_container: P
): void => {

    const children = display_object_container._$getChildren();
    for (let idx = 0; idx < children.length; ++idx) {

        const child = children[idx];
        if (!child) {
            continue;
        }

        // set root and stage
        $rootMap.set(child, display_object_container.root);
        $stageAssignedMap.add(child);

        if (child.isContainerEnabled) {
            execute(child as DisplayObjectContainer);
        }
    }
}