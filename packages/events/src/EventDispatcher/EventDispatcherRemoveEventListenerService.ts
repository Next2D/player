import type { EventDispatcherImpl } from "../interface/EventDispatcherImpl";
import type { EventListenerImpl } from "../interface/EventListenerImpl";
import { Event } from "../Event";
import {
    $broadcastEvents,
    $poolArray
} from "../EventUtil";

/**
 * @description イベントリスナーを削除。
 *              Remove the event listener.
 *
 * @param  {EventDispatcher} scope
 * @param  {string} type
 * @param  {Function} listener
 * @param  {boolean} [use_capture = false]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    scope: EventDispatcherImpl<any>,
    type: string,
    listener: Function,
    use_capture: boolean = false
): void => {

    let events: EventListenerImpl[];
    switch (type) {

        case Event.ENTER_FRAME:
        case Event.EXIT_FRAME:
        case Event.FRAME_CONSTRUCTED:
        case Event.RENDER:
        case Event.ACTIVATE:
        case Event.DEACTIVATE:
        case "keyDown":
        case "keyUp":
            if (!$broadcastEvents.size
                || !$broadcastEvents.has(type)
            ) {
                return ;
            }
            events = $broadcastEvents.get(type) as NonNullable<EventListenerImpl[]>;
            break;

        default:
            if (!scope._$events
                || !scope._$events.size
                || !scope._$events.has(type)
            ) {
                return ;
            }
            events = scope._$events.get(type) as NonNullable<EventListenerImpl[]>;
            break;

    }

    if (!events) {
        return ;
    }

    // remove listener
    for (let idx = 0; idx < events.length; ++idx) {

        // event object
        const object: EventListenerImpl = events[idx];
        if (use_capture !== object.useCapture) {
            continue ;
        }

        if (object.listener !== listener) {
            continue ;
        }

        // delete if match
        events.splice(idx, 1);

        break;
    }

    if (!events.length) {

        if ($broadcastEvents.has(type)) {
            $broadcastEvents.delete(type);
        }

        if (scope._$events && scope._$events.has(type)) {
            scope._$events.delete(type);
            if (!scope._$events.size) {
                scope._$events = null;
            }
        }

        $poolArray(events);
        return ;
    }

    if (events.length > 1) {

        // event sort(DESC)
        events.sort(function (a: EventListenerImpl, b: EventListenerImpl)
        {
            switch (true) {

                case a.priority > b.priority:
                    return -1;

                case a.priority < b.priority:
                    return 1;

                default:
                    return 0;

            }
        });

    }
};