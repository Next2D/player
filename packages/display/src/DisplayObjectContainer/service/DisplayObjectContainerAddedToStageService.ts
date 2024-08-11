import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { execute as displayObjectDispatchAddedToStageEventService } from "../../DisplayObject/service/DisplayObjectDispatchAddedToStageEventService";

/**
 * @description ステージに追加された DisplayObjectContainer の子要素のADDED_TO_STAGEイベントを発行
 *              Issue ADDED_TO_STAGE events for child elements of DisplayObjectContainer added to the stage
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

        displayObjectDispatchAddedToStageEventService(child);

        if (!child.isContainerEnabled) {
            continue;
        }

        execute(child as unknown as DisplayObjectContainer);
    }
}