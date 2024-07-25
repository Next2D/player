import type { EventListenerImpl } from "../interface/EventListenerImpl";
import type { EventDispatcherImpl } from "../interface/EventDispatcherImpl";
import { Event } from "../Event";
import { $broadcastEvents } from "../EventUtil";

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
export const execute = (
    scope: EventDispatcherImpl<any>,
    type: string
): boolean => {

    switch (type) {

        case Event.ENTER_FRAME:
        case Event.EXIT_FRAME:
        case Event.FRAME_CONSTRUCTED:
        case Event.RENDER:
        case Event.ACTIVATE:
        case Event.DEACTIVATE:
        case "keyDown":
        case "keyUp":
        {
            if ($broadcastEvents.size
                && $broadcastEvents.has(type)
            ) {
                const events: EventListenerImpl[] = $broadcastEvents.get(type) as NonNullable<EventListenerImpl[]>;
                for (let idx: number = 0; idx < events.length; idx++) {
                    if (events[idx].target === scope) {
                        return true;
                    }
                }
            }
            return false;
        }

        default:
            return !!(scope._$events
                && scope._$events.size
                && scope._$events.has(type));

    }
};