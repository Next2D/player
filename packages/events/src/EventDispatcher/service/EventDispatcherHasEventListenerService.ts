import type { EventDispatcher } from "../../EventDispatcher";
import { KeyboardEvent } from "../../KeyboardEvent";
import { Event } from "../../Event";
import { $broadcastEvents } from "../../EventUtil";

/**
 * @description 指定イベントが登録されているかを返却。
 *              Returns whether the specified event is registered.
 *
 * @param  {EventDispatcher} scope
 * @param  {string} type
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = <D extends EventDispatcher>(
    scope: D,
    type: string
): boolean => {

    switch (type) {

        case Event.ENTER_FRAME:
        case KeyboardEvent.KEY_DOWN:
        case KeyboardEvent.KEY_UP:
            return $broadcastEvents.size && $broadcastEvents.has(type) ? true : false;

        default:
            return !!(scope._$events
                && scope._$events.size
                && scope._$events.has(type));

    }
};