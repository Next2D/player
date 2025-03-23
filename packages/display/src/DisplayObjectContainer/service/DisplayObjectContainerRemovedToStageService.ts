import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as displayObjectDispatchRemovedToStageEventService } from "../../DisplayObject/service/DisplayObjectDispatchRemovedToStageEventService";

/**
 * @description ステージに追加された DisplayObjectContainer の子要素のREMOVED_FROM_STAGEイベントを発行
 *              Issue REMOVED_FROM_STAGE events for child elements of DisplayObjectContainer added to the stage
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @return {void}
 * @method
 * @protected
 */
export const execute = <C extends DisplayObjectContainer, D extends DisplayObject>(
    display_object_container: C
): void => {

    const children = display_object_container.children as D[];
    for (let idx = 0; idx < children.length; ++idx) {

        const child = children[idx];
        if (!child) {
            continue;
        }

        displayObjectDispatchRemovedToStageEventService(child);

        if (!child.isContainerEnabled) {
            continue;
        }

        execute(child as unknown as DisplayObjectContainer);
    }
};