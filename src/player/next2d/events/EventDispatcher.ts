import { Event } from "./Event";
import { Player } from "../../player/Player";
import { EventListenerImpl } from "../../../interface/EventListenerImpl";
import { EventPhase } from "./EventPhase";
import { DisplayObject } from "../display/DisplayObject";
import { DisplayObjectContainer } from "../display/DisplayObjectContainer";
import { $setCurrentLoaderInfo } from "../../util/Global";
import { $currentPlayer } from "../../util/Util";
import {
    $getMap,
    $poolMap,
    $getArray,
    $poolArray
} from "../../util/RenderUtil";

/**
 * EventDispatcher クラスは、イベントを送出するすべてのクラスの基本クラスです。
 *
 * The EventDispatcher class is the base class for all classes that dispatch events.
 *
 * @example <caption>Example usage of EventDispatcher.</caption>
 * // new ColorTransform
 * const {EventDispatcher} = next2d.events;
 * const eventDispatcher   = new EventDispatcher();
 * eventDispatcher.addEventListener(Event.ENTER_FRAME, function (event)
 * {
 *     // more...
 * });
 *
 * @class
 * @memberOf next2d.events
 */
export class EventDispatcher
{
    public _$events: Map<string, EventListenerImpl[]>|null;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {Map}
         * @default null
         * @private
         */
        this._$events = null;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class EventDispatcher]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class EventDispatcher]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events.EventDispatcher
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.events.EventDispatcher";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString (): string
    {
        return "[object EventDispatcher]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events.EventDispatcher
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.events.EventDispatcher";
    }

    /**
     * @description イベントリスナーオブジェクトを EventDispatcher オブジェクトに登録し、
     *              リスナーがイベントの通知を受け取るようにします。
     *              Registers an event listener object with an EventDispatcher object
     *              so that the listener receives notification of an event.
     *
     * @param  {string}   type
     * @param  {function} listener
     * @param  {boolean}  [use_capture=false]
     * @param  {number}   [priority=0]
     * @return {void}
     * @method
     * @public
     */
    addEventListener (
        type: string, listener: Function,
        use_capture: boolean = false,
        priority: number = 0
    ): void {

        const player: Player = $currentPlayer();

        let events: EventListenerImpl[];
        let isBroadcast: boolean = false;

        type = `${type}`;
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

                if (!player.broadcastEvents.size
                    || !player.broadcastEvents.has(type)
                ) {
                    player.broadcastEvents.set(type, $getArray());
                }

                events = player.broadcastEvents.get(type) || $getArray();

                isBroadcast = true;

                break;

            // normal event
            default:

                // init
                if (!this._$events) {
                    this._$events = $getMap();
                }

                if (!this._$events.size || !this._$events.has(type)) {
                    this._$events.set(type, $getArray());
                }

                events = this._$events.get(type) || $getArray();

                break;

        }

        // duplicate check
        let length: number = events.length;
        for (let idx: number = 0; idx < length; ++idx) {

            const event: EventListenerImpl = events[idx];
            if (use_capture !== event.useCapture) {
                continue;
            }

            if (event.target !== this) {
                continue;
            }

            if (event.listener === listener) {
                length = idx;
            }

        }

        // add or overwrite
        events[length] = {
            "listener":   listener,
            "priority":   priority,
            "useCapture": use_capture,
            "target":     this
        };

        if (events.length > 1) {

            // sort(DESC)
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

        // set new event
        if (isBroadcast) {

            player.broadcastEvents.set(type, events);

        } else {

            if (!this._$events) {
                this._$events = $getMap();
            }

            this._$events.set(type, events);
        }
    }

    /**
     * @description イベントをイベントフローに送出します。
     *              Dispatches an event into the event flow.
     *
     * @param  {Event} event
     * @return {boolean}
     * @method
     * @public
     */
    dispatchEvent (event: Event)
    {
        switch (event.type) {

            case Event.ENTER_FRAME:
            case Event.EXIT_FRAME:
            case Event.FRAME_CONSTRUCTED:
            case Event.RENDER:
            case Event.ACTIVATE:
            case Event.DEACTIVATE:
            case "keyDown":
            case "keyUp":
                {
                    const player = $currentPlayer();

                    if (player && player.broadcastEvents.size
                        && player.broadcastEvents.has(event.type)
                    ) {

                        const events: EventListenerImpl[] = player.broadcastEvents.get(event.type) as NonNullable<EventListenerImpl[]>;
                        for (let idx: number = 0; idx < events.length; ++idx) {

                            const obj: EventListenerImpl = events[idx];
                            if (obj.target !== this) {
                                continue;
                            }

                            // start target
                            event.eventPhase = EventPhase.AT_TARGET;

                            // event execute
                            event.currentTarget = obj.target;

                            try {

                                event.listener = obj.listener;
                                obj.listener.call(null, event);

                            } catch (e) {

                                console.error(e);

                                return false;

                            }
                        }

                        return true;
                    }
                }
                break;

            default:
                {

                    let events: EventListenerImpl[] | void;
                    if (this._$events
                        && this._$events.size
                        && this._$events.has(event.type)
                    ) {
                        events = this._$events.get(event.type);
                        if (events) {
                            events = events.slice(0);
                        }
                    }

                    if (!events) {
                        events = $getArray();
                    }

                    // parent
                    const parentEvents = $getArray();
                    if (this instanceof DisplayObject) {

                        let parent: DisplayObjectContainer | null = this.parent;
                        while (parent) {

                            if (parent.hasEventListener(event.type)) {

                                const events: EventListenerImpl[] | void = parent._$events
                                    ? parent._$events.get(event.type)
                                    : undefined;

                                if (events) {
                                    parentEvents.push(events);
                                }
                            }

                            parent = parent.parent;

                        }

                    }

                    event.target = this;
                    if (events.length || parentEvents.length) {

                        // start capture
                        event.eventPhase = EventPhase.CAPTURING_PHASE;

                        // stage => parent... end
                        if (parentEvents.length) {

                            switch (true) {

                                case event._$stopImmediatePropagation:
                                case event._$stopPropagation:
                                    break;

                                default:

                                    parentEvents.reverse();
                                    for (let idx: number = 0; idx < parentEvents.length; ++idx) {

                                        const targets: EventListenerImpl[] = parentEvents[idx];
                                        for (let idx: number = 0; idx < targets.length; ++idx) {

                                            const obj: EventListenerImpl = targets[idx];
                                            if (!obj.useCapture) {
                                                continue;
                                            }

                                            // event execute
                                            event.currentTarget = obj.target;
                                            $setCurrentLoaderInfo(
                                                obj.target.loaderInfo
                                            );

                                            try {

                                                event.listener = obj.listener;
                                                obj.listener.call(null, event);

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
                                    parentEvents.reverse();

                                    break;
                            }

                        }

                        // start target
                        event.eventPhase = EventPhase.AT_TARGET;
                        if (!event._$stopImmediatePropagation
                            && !event._$stopPropagation
                        ) {

                            const length: number = events.length;
                            for (let idx: number = 0; idx < length; ++idx) {

                                const obj: EventListenerImpl = events[idx];
                                if (obj.useCapture) {
                                    continue;
                                }

                                // event execute
                                event.currentTarget = obj.target;

                                $setCurrentLoaderInfo(
                                    obj.target.loaderInfo
                                );

                                try {

                                    event.listener = obj.listener;
                                    obj.listener.call(null, event);

                                } catch (e) {

                                    console.error(e);

                                    return false;
                                }

                                if (event._$stopImmediatePropagation) {
                                    break;
                                }

                            }
                        }

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

                                    const targets: EventListenerImpl[] = parentEvents[idx];
                                    for (let idx: number = 0; idx < targets.length; ++idx) {

                                        const obj: EventListenerImpl = targets[idx];
                                        if (obj.useCapture) {
                                            continue;
                                        }

                                        // event execute
                                        event.currentTarget = obj.target;
                                        $setCurrentLoaderInfo(
                                            obj.target.loaderInfo
                                        );

                                        try {

                                            event.listener = obj.listener;
                                            obj.listener.call(null, event);

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

                        $poolArray(events);
                        $poolArray(parentEvents);

                        return true;

                    }

                    $poolArray(events);
                    $poolArray(parentEvents);
                }
                break;

        }

        return false;
    }

    /**
     * @description EventDispatcher オブジェクトに、特定のイベントタイプに対して登録されたリスナーがあるかどうかを確認します。
     *              Checks whether the EventDispatcher object has any listeners registered for a specific type of event.
     *
     * @param  {string} type
     * @return {boolean}
     * @method
     * @public
     */
    hasEventListener (type: string): boolean
    {
        type = `${type}`;
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
                const player = $currentPlayer();

                if (player
                    && player.broadcastEvents.size
                    && player.broadcastEvents.has(type)
                ) {

                    const events: EventListenerImpl[] = player.broadcastEvents.get(type) || $getArray();

                    for (let idx: number = 0; idx < events.length; idx++) {
                        if (events[idx].target === this) {
                            return true;
                        }
                    }
                }
                return false;
            }

            default:
                return !!(this._$events
                    && this._$events.size
                    && this._$events.has(type));

        }
    }

    /**
     * @description EventDispatcher オブジェクトからリスナーを削除します。
     *              Removes a listener from the EventDispatcher object.
     *
     * @param  {string}   type
     * @param  {function} [listener = null]
     * @param  {boolean}  [use_capture = false]
     * @return {void}
     * @method
     * @public
     */
    removeEventListener (
        type: string, listener: Function | null,
        use_capture: boolean = false
    ): void {

        if (!listener) {
            return;
        }

        type = `${type}`;
        if (!this.hasEventListener(type)) {
            return;
        }

        const player: Player = $currentPlayer();

        let events: EventListenerImpl[] | null = null;

        let isBroadcast: boolean = false;

        switch (type) {

            case Event.ENTER_FRAME:
            case Event.EXIT_FRAME:
            case Event.FRAME_CONSTRUCTED:
            case Event.RENDER:
            case Event.ACTIVATE:
            case Event.DEACTIVATE:
            case "keyDown":
            case "keyUp":

                isBroadcast = true;

                if (player) {
                    events = player.broadcastEvents.get(type) || $getArray();
                }

                break;

            default:
                if (this._$events
                    && this._$events.size
                    && this._$events.has(type)
                ) {
                    events = this._$events.get(type) || $getArray();
                }

                break;

        }

        if (!events) {
            return ;
        }

        // remove listener
        for (let idx: number = 0; idx < events.length; ++idx) {

            // event object
            const obj: EventListenerImpl = events[idx];
            if (use_capture === obj.useCapture
                && obj.listener === listener
            ) {
                events.splice(idx, 1);
                break;
            }

        }

        if (!events.length) {

            if (isBroadcast) {

                player.broadcastEvents.delete(type);

            } else {

                if (!this._$events) {
                    return ;
                }

                this._$events.delete(type);

                if (!this._$events.size) {
                    $poolMap(this._$events);
                    this._$events = null;
                }

            }

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

        if (isBroadcast) {

            player.broadcastEvents.set(type, events);

        } else {

            if (!this._$events) {
                this._$events = $getMap();
            }

            this._$events.set(type, events);

        }
    }

    /**
     * @description EventDispatcherオブジェクトから指定したタイプのリスナーを全て削除します。
     *              Removes all listeners of the specified type from the EventDispatcher object.
     *
     * @param  {string}   type
     * @param  {boolean}  [use_capture=false]
     * @return {void}
     * @method
     * @public
     */
    removeAllEventListener (
        type: string,
        use_capture: boolean = false
    ): void {

        type = `${type}`;
        if (!this.hasEventListener(type)) {
            return;
        }

        const player = $currentPlayer();

        let events: EventListenerImpl[] | null = null;

        let isBroadcast: boolean = false;

        switch (type) {

            case Event.ENTER_FRAME:
            case Event.EXIT_FRAME:
            case Event.FRAME_CONSTRUCTED:
            case Event.RENDER:
            case Event.ACTIVATE:
            case Event.DEACTIVATE:
            case "keyDown":
            case "keyUp":

                isBroadcast = true;

                if (player) {
                    events = player.broadcastEvents.get(type) || $getArray();
                }

                break;

            default:
                if (this._$events
                    && this._$events.size
                    && this._$events.has(type)
                ) {
                    events = this._$events.get(type) || $getArray();
                }

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
            if (use_capture !== obj.useCapture) {
                results.push(obj);
            }

        }

        if (!results.length) {

            if (isBroadcast) {

                player.broadcastEvents.delete(type);

            } else {

                if (!this._$events) {
                    return ;
                }

                this._$events.delete(type);

                if (!this._$events.size) {
                    $poolMap(this._$events);
                    this._$events = null;
                }
            }

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

        if (isBroadcast) {

            player.broadcastEvents.set(type, results);

        } else {

            if (!this._$events) {
                this._$events = $getMap();
            }

            this._$events.set(type, results);
        }
    }

    /**
     * @description 指定されたイベントタイプについて、
     *              この EventDispatcher オブジェクトまたはその祖先にイベントリスナーが
     *              登録されているかどうかを確認します。
     *              Checks whether an event listener is registered
     *              with this EventDispatcher object or
     *              any of its ancestors for the specified event type.
     *
     * @param  {string}  type
     * @return {boolean}
     * @method
     * @public
     */
    willTrigger (type :string): boolean
    {
        if (this.hasEventListener(type)) {
            return true;
        }

        if (this instanceof DisplayObject) {

            let parent: DisplayObjectContainer | null = this.parent;
            while (parent) {

                if (parent.hasEventListener(type)) {
                    return true;
                }

                parent = parent.parent;
            }
        }

        return false;
    }
}