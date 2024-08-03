import type { EventListenerImpl } from "../interface/EventListenerImpl";
import type { EventDispatcher } from "../EventDispatcher";
import { Event } from "../Event";
import { KeyboardEvent } from "../KeyboardEvent";
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
export const execute = <D extends EventDispatcher>(
    scope: D,
    type: string,
    listener: Function,
    use_capture: boolean = false
): void => {

    let listenerObjects: EventListenerImpl[];
    switch (type) {

        case Event.ENTER_FRAME:
        case KeyboardEvent.KEY_DOWN:
        case KeyboardEvent.KEY_UP:
            if (!$broadcastEvents.size
                || !$broadcastEvents.has(type)
            ) {
                return ;
            }
            listenerObjects = $broadcastEvents.get(type) as NonNullable<EventListenerImpl[]>;
            break;

        default:
            if (!scope._$events
                || !scope._$events.size
                || !scope._$events.has(type)
            ) {
                return ;
            }
            listenerObjects = scope._$events.get(type) as NonNullable<EventListenerImpl[]>;
            break;

    }

    if (!listenerObjects) {
        return ;
    }

    // remove listener
    for (let idx = 0; idx < listenerObjects.length; ++idx) {

        // event object
        const object = listenerObjects[idx];
        if (use_capture !== object.useCapture) {
            continue ;
        }

        if (object.listener !== listener) {
            continue ;
        }

        // delete if match
        listenerObjects.splice(idx, 1);

        break;
    }

    if (!listenerObjects.length) {

        if ($broadcastEvents.has(type)) {
            $broadcastEvents.delete(type);
        }

        if (scope._$events && scope._$events.has(type)) {
            scope._$events.delete(type);
            if (!scope._$events.size) {
                scope._$events = null;
            }
        }

        $poolArray(listenerObjects);
        return ;
    }

    if (listenerObjects.length > 1) {

        // event sort(DESC)
        listenerObjects.sort(function (a: EventListenerImpl, b: EventListenerImpl)
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