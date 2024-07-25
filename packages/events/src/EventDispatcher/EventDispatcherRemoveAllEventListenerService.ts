import type { EventDispatcherImpl } from "../interface/EventDispatcherImpl";
import type { EventListenerImpl } from "../interface/EventListenerImpl";
import { Event } from "../Event";
import {
    $broadcastEvents,
    $getArray,
    $poolArray
} from "../EventUtil";

/**
 * @description イベントリスナーを全て削除。
 *              Remove all event listeners.
 *
 * @param  {EventDispatcher} scope
 * @param  {string} type
 * @param  {boolean} use_capture
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    scope: EventDispatcherImpl<any>,
    type: string,
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
    const results: EventListenerImpl[] = $getArray();
    for (let idx = 0; idx < events.length; ++idx) {

        // event object
        const obj: EventListenerImpl = events[idx];
        if (use_capture === obj.useCapture) {
            continue;
        }

        results.push(obj);
    }

    if (!results.length) {

        if ($broadcastEvents.has(type)) {
            $broadcastEvents.delete(type);
        }

        if (scope._$events && scope._$events.has(type)) {
            scope._$events.delete(type);
            if (!scope._$events.size) {
                scope._$events = null;
            }
        }

        $poolArray(results);
        $poolArray(events);

        return ;
    }

    if (results.length > 1) {

        // event sort (DESC)
        results.sort(function (a: EventListenerImpl, b: EventListenerImpl)
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

    if ($broadcastEvents.has(type)) {
        $broadcastEvents.set(type, results);
    } else {
        scope._$events.set(type, results);
    }

    $poolArray(events);
};