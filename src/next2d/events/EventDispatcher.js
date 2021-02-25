/**
 * @class
 * @memberOf next2d.events
 */
class EventDispatcher
{
    /**
     * EventDispatcher クラスは、イベントを送出するすべてのクラスの基本クラスです。
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
     * @constructor
     * @public
     */
    constructor()
    {
        this._$events = Util.$getMap();
        this._$target = null;
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
    static toString()
    {
        return "[class EventDispatcher]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events:EventDispatcher
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.events:EventDispatcher";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString ()
    {
        return "[object EventDispatcher]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events:EventDispatcher
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.events:EventDispatcher";
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
    addEventListener (type, listener, use_capture = false, priority = 0)
    {

        let events,
            player,
            isBroadcast = false;

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

                player = Util.$currentPlayer();

                if (!player.broadcastEvents.size
                    || !player.broadcastEvents.has(type)
                ) {
                    player.broadcastEvents.set(type, Util.$getArray());
                }

                events = player.broadcastEvents.get(type);

                isBroadcast = true;

                break;

            // normal event
            default:

                // init
                if (!this._$events.size || !this._$events.has(type)) {
                    this._$events.set(type, Util.$getArray());
                }

                events = this._$events.get(type);

                break;

        }


        // duplicate check
        let length = events.length;
        for (let idx = 0; idx < length; ++idx) {

            const event = events[idx];
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

        // set new event
        if (isBroadcast) {

            player.broadcastEvents.set(type, events);

        } else {

            // sort(DESC)
            events.sort(function (a, b)
            {
                switch (true) {

                    case (a.priority > b.priority):
                        return -1;

                    case (a.priority < b.priority):
                        return 1;

                    default:
                        return 0;

                }
            });

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
    dispatchEvent (event)
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
                    const stage = this.stage;

                    const player = (stage)
                        ? stage._$player
                        : Util.$currentPlayer();

                    if (player && player.broadcastEvents.size
                        && player.broadcastEvents.has(event.type)
                    ) {

                        const events = player.broadcastEvents.get(event.type);

                        const length = events.length;
                        for (let idx = 0; idx < length; ++idx) {

                            const obj = events[idx];
                            if (obj.target !== this) {
                                continue;
                            }

                            // start target
                            event._$eventPhase = EventPhase.AT_TARGET;

                            // event execute
                            event._$currentTarget = obj.target;
                            obj.listener.call(Util.$window, event);

                            if (Util.$error) {

                                Util.$currentPlayer()
                                    .stage
                                    .loaderInfo
                                    .uncaughtErrorEvents
                                    .dispatchEvent(
                                        new UncaughtErrorEvent(
                                            UncaughtErrorEvent.UNCAUGHT_ERROR, true, true, Util.$errorObject
                                        )
                                    );

                                // reset
                                Util.$error       = false;
                                Util.$errorObject = null;

                                return false;
                            }

                        }

                        return true;
                    }
                }
                break;

            default:
                {

                    let events = Util.$getArray();
                    if (this._$events.size && this._$events.has(event.type)) {
                        events = this._$events.get(event.type).slice(0);
                    }

                    // parent
                    const parentEvents = Util.$getArray();
                    if (this instanceof DisplayObject) {

                        let parent = this._$parent;
                        while (parent) {

                            if (parent.hasEventListener(event.type)) {
                                parentEvents[parentEvents.length] = parent._$events.get(event.type);
                            }

                            parent = parent._$parent;

                        }

                    }

                    event._$target = this;
                    if (events.length || parentEvents.length) {

                        // start capture
                        event._$eventPhase = EventPhase.CAPTURING_PHASE;

                        // stage => parent... end
                        if (parentEvents.length) {

                            switch (true) {

                                case event._$stopImmediatePropagation:
                                case event._$stopPropagation:
                                    break;

                                default:

                                    parentEvents.reverse();
                                    for (let idx = 0; idx < parentEvents.length; ++idx) {

                                        const targets = parentEvents[idx];
                                        for (let idx = 0; idx < targets.length; ++idx) {

                                            const obj = targets[idx];
                                            if (!obj.useCapture) {
                                                continue;
                                            }

                                            // event execute
                                            event._$currentTarget = obj.target;
                                            if ("__$$original" in obj.listener) {
                                                obj.listener(event);
                                            } else {
                                                obj.listener.call(Util.$window, event);
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
                        event._$eventPhase = EventPhase.AT_TARGET;
                        switch (true) {

                            case event._$stopImmediatePropagation:
                            case event._$stopPropagation:
                                break;

                            default:

                                const length = events.length;
                                for (let idx = 0; idx < length; ++idx) {

                                    const obj = events[idx];
                                    if (obj.useCapture) {
                                        continue;
                                    }

                                    // event execute
                                    event._$currentTarget = obj.target;
                                    if ("__$$original" in obj.listener) {
                                        obj.listener(event);
                                    } else {
                                        obj.listener.call(Util.$window, event);
                                    }

                                    if (event._$stopImmediatePropagation) {
                                        break;
                                    }

                                }

                                break;

                        }


                        // start bubbling
                        event._$eventPhase = EventPhase.BUBBLING_PHASE;
                        switch (true) {

                            case event._$stopImmediatePropagation:
                            case event._$stopPropagation:
                            case !event.bubbles:
                                break;

                            default:

                                // this => parent... => stage end
                                for (let idx = 0; idx < parentEvents.length; ++idx) {

                                    const targets = parentEvents[idx];
                                    for (let idx = 0; idx < targets.length; ++idx) {

                                        const obj = targets[idx];
                                        if (obj.useCapture) {
                                            continue;
                                        }

                                        // event execute
                                        event._$currentTarget = obj.target;
                                        if ("__$$original" in obj.listener) {
                                            obj.listener(event);
                                        } else {
                                            obj.listener.call(Util.$window, event);
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

                        Util.$poolArray(events);
                        Util.$poolArray(parentEvents);

                        if (Util.$error) {

                            Util.$currentPlayer()
                                .stage
                                .loaderInfo
                                .uncaughtErrorEvents
                                .dispatchEvent(
                                    new UncaughtErrorEvent(
                                        UncaughtErrorEvent.UNCAUGHT_ERROR, true, true, Util.$errorObject
                                    )
                                );

                            // reset
                            Util.$error       = false;
                            Util.$errorObject = null;

                            return false;
                        }

                        return true;

                    }

                    Util.$poolArray(events);
                    Util.$poolArray(parentEvents);
                }
                break;

        }

        return false;
    }


}








/**
 * @description イベントをイベントフローに送出します。
 *              Dispatches an event into the event flow.
 *
 * @param  {Event}   event
 * @return {boolean}
 * @public
 */
EventDispatcher.prototype.dispatchEvent = function (event)
{

    switch (event.type) {

        case "enterFrame":
        case "exitFrame":
        case "frameConstructed":
        case "render":
        case "activate":
        case "deactivate":
        case "context3DCreate":
        case "keyDown":
        case "keyUp":
        {
            const stage = this.stage;

            const player = (stage)
                ? stage._$player
                : Util.$currentPlayer();

            if (player && player.broadcastEvents.size
                && player.broadcastEvents.has(event.type)
            ) {

                const events = player.broadcastEvents.get(event.type);

                const length = events.length;
                for (let idx = 0; idx < length; ++idx) {

                    const obj = events[idx];
                    if (obj.target !== this) {
                        continue;
                    }

                    // start target
                    event._$eventPhase = EventPhase.AT_TARGET;

                    // event execute
                    event._$currentTarget = obj.target;
                    obj.listener.call(Util.$window, event);

                    if (Util.$error) {

                        Util.$currentPlayer()
                            .stage
                            .loaderInfo
                            .uncaughtErrorEvents
                            .dispatchEvent(
                                new UncaughtErrorEvent(
                                    UncaughtErrorEvent.UNCAUGHT_ERROR, true, true, Util.$errorObject
                                )
                            );

                        // reset
                        Util.$error       = false;
                        Util.$errorObject = null;

                        return false;
                    }

                }

                return true;
            }
        }
            break;

        default:
        {

            let events = Util.$getArray();
            if (this._$events.size && this._$events.has(event.type)) {
                events = this._$events.get(event.type).slice(0);
            }

            // parent
            const parentEvents = Util.$getArray();
            if (this instanceof DisplayObject) {

                let parent = this._$parent;
                while (parent) {

                    if (parent.hasEventListener(event.type)) {
                        parentEvents[parentEvents.length] = parent._$events.get(event.type);
                    }

                    parent = parent._$parent;

                }

            }

            event._$target = this;
            if (events.length || parentEvents.length) {

                // start capture
                event._$eventPhase = EventPhase.CAPTURING_PHASE;

                // stage => parent... end
                if (parentEvents.length) {

                    switch (true) {

                        case event._$stopImmediatePropagation:
                        case event._$stopPropagation:
                            break;

                        default:

                            parentEvents.reverse();
                            for (let idx = 0; idx < parentEvents.length; ++idx) {

                                const targets = parentEvents[idx];
                                for (let idx = 0; idx < targets.length; ++idx) {

                                    const obj = targets[idx];
                                    if (!obj.useCapture) {
                                        continue;
                                    }

                                    // event execute
                                    event._$currentTarget = obj.target;
                                    if ("__$$original" in obj.listener) {
                                        obj.listener(event);
                                    } else {
                                        obj.listener.call(Util.$window, event);
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
                event._$eventPhase = EventPhase.AT_TARGET;
                switch (true) {

                    case event._$stopImmediatePropagation:
                    case event._$stopPropagation:
                        break;

                    default:

                        const length = events.length;
                        for (let idx = 0; idx < length; ++idx) {

                            const obj = events[idx];
                            if (obj.useCapture) {
                                continue;
                            }

                            // event execute
                            event._$currentTarget = obj.target;
                            if ("__$$original" in obj.listener) {
                                obj.listener(event);
                            } else {
                                obj.listener.call(Util.$window, event);
                            }

                            if (event._$stopImmediatePropagation) {
                                break;
                            }

                        }

                        break;

                }


                // start bubbling
                event._$eventPhase = EventPhase.BUBBLING_PHASE;
                switch (true) {

                    case event._$stopImmediatePropagation:
                    case event._$stopPropagation:
                    case !event.bubbles:
                        break;

                    default:

                        // this => parent... => stage end
                        for (let idx = 0; idx < parentEvents.length; ++idx) {

                            const targets = parentEvents[idx];
                            for (let idx = 0; idx < targets.length; ++idx) {

                                const obj = targets[idx];
                                if (obj.useCapture) {
                                    continue;
                                }

                                // event execute
                                event._$currentTarget = obj.target;
                                if ("__$$original" in obj.listener) {
                                    obj.listener(event);
                                } else {
                                    obj.listener.call(Util.$window, event);
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

                Util.$poolArray(events);
                Util.$poolArray(parentEvents);

                if (Util.$error) {

                    Util.$currentPlayer()
                        .stage
                        .loaderInfo
                        .uncaughtErrorEvents
                        .dispatchEvent(
                            new UncaughtErrorEvent(
                                UncaughtErrorEvent.UNCAUGHT_ERROR, true, true, Util.$errorObject
                            )
                        );

                    // reset
                    Util.$error       = false;
                    Util.$errorObject = null;

                    return false;
                }

                return true;

            }

            Util.$poolArray(events);
            Util.$poolArray(parentEvents);
        }
            break;

    }

    // pool
    Util.$poolInstance(event);

    return false;
};

/**
 * @description EventDispatcher オブジェクトに、特定のイベントタイプに対して登録されたリスナーがあるかどうかを確認します。
 *              Checks whether the EventDispatcher object has any listeners registered for a specific type of event.
 *
 * @param   {string}  type
 * @returns {boolean}
 * @public
 */
EventDispatcher.prototype.hasEventListener = function (type)
{
    switch (type) {

        case "enterFrame":
        case "exitFrame":
        case "frameConstructed":
        case "render":
        case "activate":
        case "deactivate":
        case "context3DCreate":
        case "keyDown":
        case "keyUp":

            const stage  = this.stage;
            const player = (stage)
                ? stage._$player
                : Util.$currentPlayer();

            if (player && player.broadcastEvents.size
                && player.broadcastEvents.has(type)
            ) {
                const events = player.broadcastEvents.get(type);

                for (let idx = 0; idx < events.length; idx++) {
                    if (events[idx].target === this) {
                        return true;
                    }
                }
            }
            return false;

        default:
            return this._$events.size && this._$events.has(type);

    }
};

/**
 * @description EventDispatcher オブジェクトからリスナーを削除します。
 *              Removes a listener from
 * the EventDispatcher object.
 *
 * @param   {string}   type
 * @param   {function} listener
 * @param   {boolean}  [use_capture=false]
 * @returns void
 * @public
 */
EventDispatcher.prototype.removeEventListener = function (type, listener, use_capture = false)
{

    if (!this.hasEventListener(type) || typeof listener !== "function") {
        return;
    }


    const useCapture = Util.$toBoolean(use_capture);
    let isBroadcast  = false;

    let events, player;
    switch (type) {

        case "enterFrame":
        case "exitFrame":
        case "frameConstructed":
        case "render":
        case "activate":
        case "deactivate":
        case "context3DCreate":
        case "keyDown":
        case "keyUp":

            isBroadcast = true;

            player = Util.$currentPlayer();
            if (player) {
                events = player.broadcastEvents.get(type);
            }

            break;

        default:
            events = this._$events.get(type);
            break;

    }


    // remove listener
    let method = listener;
    let caller = null;
    if ("__$$original" in listener) {
        method = listener.__$$original;
        caller = listener.__$$caller;
    }

    const length = events.length;
    for (let idx = 0; idx < length; ++idx) {

        // event object
        const obj = events[idx];

        if (useCapture === obj.useCapture) {

            let original = obj.listener;
            let target   = null;
            if ("__$$original" in obj.listener) {
                original = obj.listener.__$$original;
                target   = obj.listener.__$$caller;
            }

            if (original === method && caller === target) {
                events.splice(idx, 1);
                break;
            }

        }

    }

    // set new event
    switch (true) {

        case events.length === 0:

            switch (true) {

                case isBroadcast:
                    player.broadcastEvents.delete(type);
                    break;

                default:
                    this._$events.delete(type);
                    break;

            }

            break;

        default:

            switch (true) {

                case isBroadcast:
                    player.broadcastEvents.set(type, events);
                    break;

                default:

                    // event sort
                    events.sort(function (a, b)
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

                    this._$events.set(type, events);
                    break;

            }

            break;

    }

};

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
 * @public
 */
EventDispatcher.prototype.willTrigger = function (type)
{
    if (this.hasEventListener(type)) {
        return true;
    }

    let parent = this.parent;
    while (parent) {

        if (parent.hasEventListener(type)) {
            return true;
        }

        parent = parent.parent;
    }

    return false;
};