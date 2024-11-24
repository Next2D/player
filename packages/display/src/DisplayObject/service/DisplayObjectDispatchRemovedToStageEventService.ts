import type { DisplayObject } from "../../DisplayObject";
import { Event } from "@next2d/events";
import { $stageAssignedMap } from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectのREMOVED_FROM_STAGEイベントを実行
 *              Execute the REMOVED_FROM_STAGE event of DisplayObject
 *
 * @param  {DisplayObject} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): void =>
{
    if (!display_object.$addedToStage
        || !$stageAssignedMap.has(display_object)
    ) {
        return ;
    }

    display_object.$addedToStage = false;
    if (display_object.willTrigger(Event.REMOVED_FROM_STAGE)) {
        display_object.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));
    }
};