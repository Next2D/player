import type { IEventListener } from "../../interface/IEventListener";
import type { EventDispatcher } from "../../EventDispatcher";
import { Event } from "../../Event";
import { KeyboardEvent } from "../../KeyboardEvent";
import {
    $broadcastEvents,
    $getArray
} from "../../EventUtil";

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
export const execute = <D extends EventDispatcher>(
    scope: D,
    type: string,
    listener: Function,
    use_capture: boolean = false,
    priority: number = 0
): void => {

    let listenerObjects: IEventListener[];
    switch (type) {

        // broadcast event
        case Event.ENTER_FRAME:
        case KeyboardEvent.KEY_DOWN:
        case KeyboardEvent.KEY_UP:

            if (!$broadcastEvents.size
                || !$broadcastEvents.has(type)
            ) {
                $broadcastEvents.set(type, $getArray());
            }

            listenerObjects = $broadcastEvents.get(type) as NonNullable<IEventListener[]>;

            break;

        // normal event
        default:

            if (!scope._$events) {
                scope._$events = new Map();
            }

            if (!scope._$events.size || !scope._$events.has(type)) {
                scope._$events.set(type, $getArray());
            }

            listenerObjects = scope._$events.get(type) as NonNullable<IEventListener[]>;

            break;

    }

    // duplicate check
    const length = listenerObjects.length;
    let index = 0;
    for ( ; index < length; ++index) {

        const object = listenerObjects[index];
        if (use_capture !== object.useCapture) {
            continue;
        }

        if (object.target !== scope) {
            continue;
        }

        if (object.listener !== listener) {
            continue;
        }

        break;
    }

    // add or overwrite
    if (length === index) {
        // add
        listenerObjects.push({
            "listener":   listener,
            "priority":   priority,
            "useCapture": use_capture,
            "target":     scope
        });
    } else {
        // overwrite
        const object = listenerObjects[index];
        object.listener = listener;
        object.priority = priority;
        object.useCapture = use_capture;
        object.target = scope;
    }

    if (listenerObjects.length > 1) {

        // sort(DESC)
        listenerObjects.sort((a, b): number =>
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