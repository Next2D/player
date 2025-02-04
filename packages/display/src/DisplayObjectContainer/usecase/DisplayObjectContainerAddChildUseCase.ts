import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as displayObjectContainerAssignStageAndRootService } from "../service/DisplayObjectContainerAssignStageAndRootService";
import { execute as displayObjectContainerAddedToStageService } from "../service/DisplayObjectContainerAddedToStageService";
import { execute as displayObjectApplyChangesService } from "../../DisplayObject/service/DisplayObjectApplyChangesService";
import { execute as displayObjectDispatchAddedEventService } from "../../DisplayObject/service/DisplayObjectDispatchAddedEventService";
import { execute as displayObjectDispatchAddedToStageEventService } from "../../DisplayObject/service/DisplayObjectDispatchAddedToStageEventService";
import {
    $rootMap,
    $stageAssignedMap
} from "../../DisplayObjectUtil";

/**
 * @description 指定のDisplayObjectContainerに子要素を追加する
 *              Add a child element to the specified DisplayObjectContainer
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {DisplayObject} display_object
 * @return {DisplayObject}
 * @method
 * @public
 */
export const execute = <P extends DisplayObjectContainer, D extends DisplayObject>(
    display_object_container: P,
    display_object: D,
    index: number = -1
): D => {

    const parent = display_object.parent;
    if (parent) {
        parent.removeChild(display_object);
    }

    // added display object
    const children = display_object_container.children;
    if (0 > index) {
        children.push(display_object);
    } else {
        children.splice(index, 0, display_object);
    }

    // cache clear
    display_object_container.$container = null;

    // Set parent-child relationship
    display_object.parent = display_object_container;

    // 親が Stage に追加されている場合は、マップデータに情報を追加
    if ($stageAssignedMap.has(display_object_container)) {

        if (!$rootMap.has(display_object)) {
            $rootMap.set(display_object, display_object_container.root);
        }

        if ($stageAssignedMap.has(display_object)) {
            $stageAssignedMap.add(display_object);
        }

        // If container functionality is available, set stage and root for small elements
        if (display_object.isContainerEnabled) {
            displayObjectContainerAssignStageAndRootService(
                display_object as unknown as DisplayObjectContainer
            );
        }
    }

    // Dispatch added event
    displayObjectDispatchAddedEventService(display_object);

    if ($stageAssignedMap.has(display_object_container)) {
        displayObjectDispatchAddedToStageEventService(display_object);

        if (display_object.isContainerEnabled) {
            displayObjectContainerAddedToStageService(
                display_object as unknown as DisplayObjectContainer
            );
        }
    }

    displayObjectApplyChangesService(display_object);

    return display_object;
};