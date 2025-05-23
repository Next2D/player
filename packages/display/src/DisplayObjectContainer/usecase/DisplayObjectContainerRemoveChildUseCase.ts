import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { Video } from "@next2d/media";
import { execute as displayObjectApplyChangesService } from "../../DisplayObject/service/DisplayObjectApplyChangesService";
import { execute as displayObjectContainerUnAssignStageAndRootService } from "../service/DisplayObjectContainerUnAssignStageAndRootService";
import { execute as displayObjectDispatchRemovedEventService } from "../../DisplayObject/service/DisplayObjectDispatchRemovedEventService";
import { execute as displayObjectDispatchRemovedToStageEventService } from "../../DisplayObject/service/DisplayObjectDispatchRemovedToStageEventService";
import { execute as displayObjectContainerRemovedToStageService } from "../service/DisplayObjectContainerRemovedToStageService";
import {
    Event,
    KeyboardEvent
} from "@next2d/events";
import {
    $rootMap,
    $stageAssignedMap
} from "../../DisplayObjectUtil";

/**
 * @description 指定の DisplayObject を DisplayObjectContainer から削除します。
 *              Deletes the specified DisplayObject from the DisplayObjectContainer.
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {DisplayObject} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <P extends DisplayObjectContainer, D extends DisplayObject>(
    display_object_container: P,
    display_object: D
): void => {

    const parent = display_object.parent;
    if (parent
        && (parent as unknown as DisplayObjectContainer).instanceId !== display_object_container.instanceId
    ) {
        return ;
    }

    const children = display_object_container.children;
    const depth = children.indexOf(display_object);
    if (depth > -1) {
        children.splice(depth, 1);
    }

    // cache clear
    display_object_container.$container = null;

    // remove all broadcast events
    if (display_object.hasEventListener(Event.ENTER_FRAME)) {
        display_object.removeAllEventListener(Event.ENTER_FRAME);
    }
    if (display_object.hasEventListener(KeyboardEvent.KEY_DOWN)) {
        display_object.removeAllEventListener(KeyboardEvent.KEY_DOWN);
    }
    if (display_object.hasEventListener(KeyboardEvent.KEY_UP)) {
        display_object.removeAllEventListener(KeyboardEvent.KEY_UP);
    }

    // dispatch removed event
    displayObjectDispatchRemovedEventService(display_object);

    // ステージに登録されている場合はステージからの削除イベントを実行
    if ($stageAssignedMap.has(display_object_container.instanceId)) {

        displayObjectDispatchRemovedToStageEventService(display_object);

        if (display_object.isContainerEnabled) {
            displayObjectContainerRemovedToStageService(
                display_object as unknown as DisplayObjectContainer
            );
        }
    }

    // remove root and stage
    if ($stageAssignedMap.has(display_object_container.instanceId)) {

        $rootMap.delete(display_object);
        $stageAssignedMap.delete(display_object.instanceId);

        if (display_object.isVideo) {
            (display_object as unknown as Video).pause();
        }

        // コンテナであれば子孫の DisplayObject に対しても Stage と Root を解除
        if (display_object.isContainerEnabled) {
            displayObjectContainerUnAssignStageAndRootService(
                display_object as unknown as DisplayObjectContainer
            );
        }
    }

    // remove parent-child relationship
    display_object.parent = null;

    // apply changes
    displayObjectApplyChangesService(display_object_container);
};