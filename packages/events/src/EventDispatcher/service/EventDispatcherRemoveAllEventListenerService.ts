import type { IEventListener } from "../../interface/IEventListener";
import type { EventDispatcher } from "../../EventDispatcher";
import { KeyboardEvent } from "../../KeyboardEvent";
import { Event } from "../../Event";
import {
    $broadcastEvents,
    $getArray,
    $poolArray
} from "../../EventUtil";

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
export const execute = <D extends EventDispatcher>(
    scope: D,
    type: string,
    use_capture: boolean = false
): void => {

    let listenerObjects: IEventListener[];
    switch (type) {

        case Event.ENTER_FRAME:
        case KeyboardEvent.KEY_DOWN:
        case KeyboardEvent.KEY_UP:
            if (!$broadcastEvents.size
                || !$broadcastEvents.has(type)
            ) {
                return ;
            }
            listenerObjects = $broadcastEvents.get(type) as NonNullable<IEventListener[]>;
            break;

        default:
            if (!scope._$events
                || !scope._$events.size
                || !scope._$events.has(type)
            ) {
                return ;
            }
            listenerObjects = scope._$events.get(type) as NonNullable<IEventListener[]>;
            break;

    }

    if (!listenerObjects) {
        return ;
    }

    // remove listener
    const results: IEventListener[] = $getArray();
    for (let idx = 0; idx < listenerObjects.length; ++idx) {

        // event object
        const object = listenerObjects[idx];
        if (use_capture === object.useCapture) {
            continue;
        }

        results.push(object);
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
        $poolArray(listenerObjects);

        return ;
    }

    if (results.length > 1) {

        // event sort (DESC)
        results.sort((a, b): number =>
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
        scope._$events?.set(type, results);
    }

    $poolArray(listenerObjects);
};