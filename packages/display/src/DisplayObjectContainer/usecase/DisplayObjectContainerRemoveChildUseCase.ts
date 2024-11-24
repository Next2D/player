import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as displayObjectApplyChangesService } from "../../DisplayObject/service/DisplayObjectApplyChangesService";
import { execute as displayObjectContainerUnAssignStageAndRootService } from "../service/DisplayObjectContainerUnAssignStageAndRootService";
import { execute as displayObjectDispatchRemovedEventService } from "../../DisplayObject/service/DisplayObjectDispatchRemovedEventService";
import { execute as displayObjectDispatchRemovedToStageEventService } from "../../DisplayObject/service/DisplayObjectDispatchRemovedToStageEventService";
import { execute as displayObjectContainerRemovedToStageService } from "../service/DisplayObjectContainerRemovedToStageService";
import {
    $parentMap,
    $rootMap,
    $stageAssignedMap
} from "../../DisplayObjectUtil";

/**
 * @description 指定の DisplayObject を DisplayObjectContainer から削除します。
 *              Deletes the specified DisplayObject from the DisplayObjectContainer.
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {DisplayObject} display_object
 * @return {DisplayObject}
 * @method
 * @protected
 */
export const execute = <P extends DisplayObjectContainer, D extends DisplayObject>(
    display_object_container: P,
    display_object: D
): D => {

    const children = display_object_container.children;
    const depth = children.indexOf(display_object);
    if (depth > -1) {
        children.splice(depth, 1);
    }

    // dispatch removed event
    displayObjectDispatchRemovedEventService(display_object);

    // ステージに登録されている場合はステージからの削除イベントを実行
    if ($stageAssignedMap.has(display_object_container)) {
        displayObjectDispatchRemovedToStageEventService(display_object);

        if (display_object.isContainerEnabled) {
            displayObjectContainerRemovedToStageService(
                display_object as unknown as DisplayObjectContainer
            );
        }
    }

    // remove root and stage
    if ($stageAssignedMap.has(display_object_container)) {
        if (!$rootMap.has(display_object)) {
            $rootMap.delete(display_object);
        }

        if ($stageAssignedMap.has(display_object)) {
            $stageAssignedMap.delete(display_object);
        }

        // コンテナであれば子孫の DisplayObject に対しても Stage と Root を解除
        if (display_object.isContainerEnabled) {
            displayObjectContainerUnAssignStageAndRootService(
                display_object as unknown as DisplayObjectContainer
            );
        }
    }

    // remove parent-child relationship
    if ($parentMap.has(display_object)) {
        $parentMap.delete(display_object);
    }

    // apply changes
    displayObjectApplyChangesService(display_object_container);

    return display_object;
};