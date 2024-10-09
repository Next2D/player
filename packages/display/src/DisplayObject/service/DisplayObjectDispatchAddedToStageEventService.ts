import type { DisplayObject } from "../../DisplayObject";
import { Event } from "@next2d/events";
import { $stageAssignedMap } from "../../DisplayObjectUtil";

/**
 * @description DisplayObjectのADDED_TO_STAGEイベントを実行
 *              Execute the ADDED_TO_STAGE event of DisplayObject
 * 
 * @param  {DisplayObject} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): void =>
{
    if (display_object.$addedToStage 
        || !$stageAssignedMap.has(display_object)
    ) {
        return ;
    }
   
    display_object.$addedToStage = true;
    if (display_object.willTrigger(Event.ADDED_TO_STAGE)) {
        display_object.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
    }
};