import type { EventListenerImpl } from "../interface/EventListenerImpl";
import type { EventDispatcherImpl } from "../interface/EventDispatcherImpl";
import { Event } from "../Event";
import {
    $broadcastEvents,
    $getArray
} from "../EventUtil";

/**
 * @description 指定イベントに関数を登録、既に登録されている場合は上書。
 *              Register a function in the specified event, or overwrite if already registered.
 *
 * @param {EventDispatcher} scope
 * @param {string} type
 * @param {Function} listener
 * @param {boolean} [use_capture = false]
 * @param {number} [priority = 0]
 * @method
 * @protected
 */
export const execute = (
    scope: EventDispatcherImpl<any>,
    type: string,
    listener: Function,
    use_capture: boolean = false,
    priority: number = 0
): void => {

    let events: EventListenerImpl[];
    switch (type) {

        // broadcast event
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
                $broadcastEvents.set(type, $getArray());
            }

            events = $broadcastEvents.get(type) as NonNullable<EventListenerImpl[]>;

            break;

        // normal event
        default:

            // init
            if (!scope._$events) {
                scope._$events = new Map();
            }

            if (!scope._$events.size || !scope._$events.has(type)) {
                scope._$events.set(type, $getArray());
            }

            events = scope._$events.get(type) as NonNullable<EventListenerImpl[]>;

            break;

    }

    // duplicate check
    const length: number = events.length;
    let index = 0;
    for ( ; index < length; ++index) {

        const event: EventListenerImpl = events[index];
        if (use_capture !== event.useCapture) {
            continue;
        }

        if (event.target !== scope) {
            continue;
        }

        if (event.listener !== listener) {
            continue;
        }

        break;
    }

    // add or overwrite
    if (length === index) {
        // add
        events.push({
            "listener":   listener,
            "priority":   priority,
            "useCapture": use_capture,
            "target":     scope
        });
    } else {
        // overwrite
        const event: EventListenerImpl = events[index];
        event.listener = listener;
        event.priority = priority;
        event.useCapture = use_capture;
        event.target = scope;
    }

    if (events.length > 1) {

        // sort(DESC)
        events.sort((a: EventListenerImpl, b: EventListenerImpl): number =>
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