import type { IEventListener } from "../interface/IEventListener";
import type { EventDispatcher } from "../EventDispatcher";
import { Event } from "../Event";
import { KeyboardEvent } from "../KeyboardEvent";
import { EventPhase } from "../EventPhase";
import {
    $broadcastEvents,
    $getArray,
    $poolArray
} from "../EventUtil";

/**
 * @description 指定のイベントを実行します。
 *              Executes the specified event.
 *
 * @param  {EventDispatcher} scope
 * @param  {Event} event
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = <D extends EventDispatcher, E extends Event>(
    scope: D,
    event: E
):  boolean => {

    switch (event.type) {

        case Event.ENTER_FRAME:
        case KeyboardEvent.KEY_DOWN:
        case KeyboardEvent.KEY_UP:
            {
                if (!$broadcastEvents.size
                    || !$broadcastEvents.has(event.type)
                ) {
                    return false;
                }

                const listenerObjects = $broadcastEvents.get(event.type) as NonNullable<IEventListener[]>;
                if (!listenerObjects.length) {
                    return false;
                }

                for (let idx = 0; idx < listenerObjects.length; ++idx) {

                    const object = listenerObjects[idx];

                    // start target
                    event.eventPhase = EventPhase.AT_TARGET;

                    // event execute
                    event.target = event.currentTarget = object.target;

                    try {

                        event.listener = object.listener;
                        object.listener(event);

                    } catch (e) {

                        console.error(e);

                        return false;

                    }
                }
            }
            return true;

        default:
            {
                event.target = scope;

                let currentEvents: IEventListener[] | null = null;
                if (scope._$events
                    && scope._$events.size
                    && scope._$events.has(event.type)
                ) {
                    const events = scope._$events.get(event.type);
                    if (events) {
                        currentEvents = events.slice(0);
                    }
                }

                // parent
                const parentEvents = $getArray();
                if ("parent" in scope) {

                    let parent = scope.parent as D | null;
                    while (parent) {

                        if (parent.hasEventListener(event.type)) {

                            const events: IEventListener[] | null = parent._$events && parent._$events.has(event.type)
                                ? parent._$events.get(event.type) as NonNullable<IEventListener[]>
                                : null;

                            if (events) {
                                parentEvents.push(events);
                            }
                        }

                        if (!("parent" in parent)) {
                            break;
                        }

                        parent = parent.parent as D | null;

                    }

                }

                if (!currentEvents && !parentEvents.length) {
                    if (currentEvents) {
                        $poolArray(currentEvents);
                    }
                    $poolArray(parentEvents);
                    return false;
                }

                // stage => child... end
                if (parentEvents.length) {

                    // start capture
                    event.eventPhase = EventPhase.CAPTURING_PHASE;

                    switch (true) {

                        case event._$stopImmediatePropagation:
                        case event._$stopPropagation:
                            break;

                        default:
                            for (let idx = parentEvents.length - 1; idx > -1; --idx) {

                                const events: IEventListener[] = parentEvents[idx];
                                for (let idx: number = 0; idx < events.length; ++idx) {

                                    const object: IEventListener = events[idx];
                                    if (!object.useCapture) {
                                        continue;
                                    }

                                    // event execute
                                    event.currentTarget = object.target;

                                    try {

                                        event.listener = object.listener;
                                        object.listener.call(null, event);

                                    } catch (e) {

                                        console.error(e);

                                        return false;
                                    }

                                    if (event._$stopImmediatePropagation) {
                                        break;
                                    }

                                }

                                if (event._$stopImmediatePropagation) {
                                    break;
                                }

                            }
                            break;
                    }

                }

                if (currentEvents
                    && !event._$stopImmediatePropagation
                    && !event._$stopPropagation
                ) {

                    // start target
                    event.eventPhase = EventPhase.AT_TARGET;

                    for (let idx: number = 0; idx < currentEvents.length; ++idx) {

                        const object = currentEvents[idx];
                        if (object.useCapture) {
                            continue;
                        }

                        // event execute
                        event.currentTarget = object.target;
                        try {

                            event.listener = object.listener;
                            object.listener.call(null, event);

                        } catch (e) {

                            console.error(e);

                            return false;
                        }

                        if (event._$stopImmediatePropagation) {
                            break;
                        }

                    }

                    $poolArray(currentEvents);
                }

                if (parentEvents.length) {

                    // start bubbling
                    event.eventPhase = EventPhase.BUBBLING_PHASE;

                    switch (true) {

                        case event._$stopImmediatePropagation:
                        case event._$stopPropagation:
                        case !event.bubbles:
                            break;

                        default:

                            // this => parent... => stage end
                            for (let idx: number = 0; idx < parentEvents.length; ++idx) {

                                const events: IEventListener[] = parentEvents[idx];
                                for (let idx: number = 0; idx < events.length; ++idx) {

                                    const object = events[idx];
                                    if (object.useCapture) {
                                        continue;
                                    }

                                    // event execute
                                    event.currentTarget = object.target;

                                    try {

                                        event.listener = object.listener;
                                        object.listener.call(null, event);

                                    } catch (e) {

                                        console.error(e);

                                        return false;
                                    }

                                    if (event._$stopImmediatePropagation) {
                                        break;
                                    }
                                }

                                if (event._$stopImmediatePropagation) {
                                    break;
                                }

                            }

                            break;

                    }

                    $poolArray(parentEvents);
                }
            }
            return true;

    }
};