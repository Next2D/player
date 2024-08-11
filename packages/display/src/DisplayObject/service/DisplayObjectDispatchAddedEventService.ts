import type { DisplayObject } from "../../DisplayObject";
import { Event } from "@next2d/events";

/**
 * @description DisplayObjectのADDEDイベントを実行
 *              Execute the ADDED event of DisplayObject
 * 
 * @param  {DisplayObject} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): void =>
{
    if (display_object.$added) {
        return ;
    }

    display_object.$added = true;
    if (display_object.willTrigger(Event.ADDED)) {
        display_object.dispatchEvent(new Event(Event.ADDED, true));
    }
};