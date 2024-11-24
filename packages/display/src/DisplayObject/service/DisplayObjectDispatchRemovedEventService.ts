import type { DisplayObject } from "../../DisplayObject";
import { Event } from "@next2d/events";

/**
 * @description DisplayObjectのREMOVEDイベントを実行
 *              Execute the REMOVED event of DisplayObject
 *
 * @param  {DisplayObject} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): void =>
{
    if (!display_object.$added) {
        return ;
    }

    display_object.$added = false;
    if (display_object.willTrigger(Event.REMOVED)) {
        display_object.dispatchEvent(new Event(Event.REMOVED, true));
    }
};