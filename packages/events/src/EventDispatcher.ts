import type { Event } from "./Event";
import type { IEventListener } from "./interface/IEventListener";
import { execute as eventDispatcherAddEventListenerService } from "./EventDispatcher/EventDispatcherAddEventListenerService";
import { execute as eventDispatcherHasEventListenerService } from "./EventDispatcher/EventDispatcherHasEventListenerService";
import { execute as eventDispatcherRemoveEventListenerService } from "./EventDispatcher/EventDispatcherRemoveEventListenerService";
import { execute as eventDispatcherRemoveAllEventListenerService } from "./EventDispatcher/EventDispatcherRemoveAllEventListenerService";
import { execute as eventDispatcherWillTriggerService } from "./EventDispatcher/EventDispatcherWillTriggerService";
import { execute as eventDispatcherDispatchEventService } from "./EventDispatcher/EventDispatcherDispatchEventService";

/**
 * @description EventDispatcher クラスは、イベントを送出するすべてのクラスの基本クラスです。
 *              The EventDispatcher class is the base class for all classes that dispatch events.
 *
 * @class
 * @memberOf next2d.events
 */
export class EventDispatcher
{
    public _$events: Map<string, IEventListener[]> | null;

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
     * @description クラスの空間名を返します。
     *              Returns the space name of the class.
     *
     * @member {string}
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.events.EventDispatcher";
    }

    /**
     * @description オブジェクトの空間名を返します。
     *              Returns the space name of the object.
     *
     * @member {string}
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
     * @param  {boolean}  [use_capture = false]
     * @param  {number}   [priority = 0]
     * @return {void}
     * @method
     * @public
     */
    addEventListener (
        type: string,
        listener: Function,
        use_capture: boolean = false,
        priority: number = 0
    ): void {
        if (!this._$events) {
            this._$events = new Map();
        }

        eventDispatcherAddEventListenerService(
            this, type, listener, use_capture, priority
        );
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
    dispatchEvent (event: Event): boolean
    {
        return eventDispatcherDispatchEventService(this, event);
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
        return eventDispatcherHasEventListenerService(this, type);
    }

    /**
     * @description EventDispatcher オブジェクトからリスナーを削除します。
     *              Removes a listener from the EventDispatcher object.
     *
     * @param  {string}   type
     * @param  {function} listener
     * @param  {boolean}  [use_capture = false]
     * @return {void}
     * @method
     * @public
     */
    removeEventListener (
        type: string,
        listener: Function,
        use_capture: boolean = false
    ): void {
        eventDispatcherRemoveEventListenerService(
            this, type, listener, use_capture
        );
    }

    /**
     * @description EventDispatcherオブジェクトから指定したタイプのリスナーを全て削除します。
     *              Removes all listeners of the specified type from the EventDispatcher object.
     *
     * @param  {string}  type
     * @param  {boolean} [use_capture=false]
     * @return {void}
     * @method
     * @public
     */
    removeAllEventListener (
        type: string,
        use_capture: boolean = false
    ): void {
        eventDispatcherRemoveAllEventListenerService(
            this, type, use_capture
        );
    }

    /**
     * @description 指定されたイベントタイプについて、
     *              この EventDispatcher オブジェクトまたはその祖先にイベントリスナーが
     *              登録されているかどうかを確認します。
     *              Checks whether an event listener is registered
     *              with this EventDispatcher object or
     *              any of its ancestors for the specified event type.
     *
     * @param  {string} type
     * @return {boolean}
     * @method
     * @public
     */
    willTrigger (type: string): boolean
    {
        return eventDispatcherWillTriggerService(this, type);
    }
}