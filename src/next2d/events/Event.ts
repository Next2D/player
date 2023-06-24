import { EventPhase } from "./EventPhase";
import type { EventDispatcherImpl } from "../../interface/EventDispatcherImpl";

/**
 * Event クラスのメソッドは、イベントリスナー関数で使用してイベントオブジェクトの動作に影響を与えることができます。
 * 一部のイベントにはデフォルトの動作が関連付けられています。
 * 例えば、doubleClick イベントには、イベント時にマウスポインター位置の単語がハイライト表示されるというデフォルトの動作が関連付けられています。
 * イベントリスナーで preventDefault() メソッドを呼び出してこの動作をキャンセルできます。
 * また、stopPropagation() メソッドまたは stopImmediatePropagation() メソッドを呼び出すと、
 * 現在のイベントリスナーを、イベントを処理する最後のイベントリスナーにすることができます。
 *
 * The methods of the Event class can be used in event listener functions to affect the behavior of the event object.
 * Some events have an associated default behavior. For example,
 * the doubleClick event has an associated default behavior that highlights the word under the mouse pointer at the time of the event.
 * Your event listener can cancel this behavior by calling the preventDefault() method.
 * You can also make the current event listener the last one to process
 * an event by calling the stopPropagation() or stopImmediatePropagation() method.
 *
 * @class
 * @memberOf next2d.events
 */
export class Event
{
    private readonly _$type: string;
    private readonly _$bubbles: boolean;
    private readonly _$cancelable: boolean;
    private _$target: EventDispatcherImpl<any> | null;
    private _$currentTarget: EventDispatcherImpl<any> | null;
    private _$listener: Function | null;
    private _$eventPhase: number;
    public _$stopImmediatePropagation: boolean;
    public _$stopPropagation: boolean;

    /**
     * @param {string}  type
     * @param {boolean} [bubbles=false]
     * @param {boolean} [cancelable=false]
     *
     * @constructor
     * @public
     */
    constructor (
        type: string,
        bubbles: boolean = false,
        cancelable: boolean = false
    ) {

        /**
         * @type {string}
         * @private
         */
        this._$type = `${type}`;

        /**
         * @type {boolean}
         * @private
         */
        this._$bubbles = bubbles;

        /**
         * @type {boolean}
         * @private
         */
        this._$cancelable = cancelable;

        /**
         * @type {EventDispatcher}
         * @private
         */
        this._$target = null;

        /**
         * @type {EventDispatcher}
         * @default null
         * @private
         */
        this._$currentTarget = null;

        /**
         * @type    {number}
         * @default EventPhase.AT_TARGET
         * @private
         */
        this._$eventPhase = EventPhase.AT_TARGET;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$listener = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$stopImmediatePropagation = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$stopPropagation = false;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Event]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Event]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events.Event
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.events.Event";
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
        return this.formatToString("Event", "type", "bubbles", "cancelable", "eventPhase");
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events.Event
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.events.Event";
    }

    /**
     * @description ACTIVATE 定数は、type プロパティ（activate イベントオブジェクト）の値を定義します。
     *              The ACTIVATE constant defines the value
     *              of the type property of an activate event object.
     *
     * @return  {string}
     * @default activate
     * @const
     * @static
     */
    static get ACTIVATE (): string
    {
        return "activate";
    }

    /**
     * @description Event.ADDED 定数は、added イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.ADDED constant defines the value
     *              of the type property of an added event object.
     *
     * @return  {string}
     * @default added
     * @const
     * @static
     */
    static get ADDED (): string
    {
        return "added";
    }

    /**
     * @description Event.ADDED_TO_STAGE 定数は、type プロパティ（addedToStage イベントオブジェクト）の値を定義します。
     *              The Event.ADDED_TO_STAGE constant defines the value
     *              of the type property of an addedToStage event object.
     *
     * @return  {string}
     * @default addedToStage
     * @const
     * @static
     */
    static get ADDED_TO_STAGE (): string
    {
        return "addedToStage";
    }

    /**
     * @description Event.CHANGE 定数は、type プロパティ（change イベントオブジェクト）の値を定義します。
     *              The Event.CHANGE constant defines the value
     *              of the type property of a change event object.
     *
     * @return  {string}
     * @default change
     * @const
     * @static
     */
    static get CHANGE (): string
    {
        return "change";
    }

    /**
     * @description Event.COMPLETE 定数は、complete イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.COMPLETE constant defines the value
     *              of the type property of a complete event object.
     *
     * @return  {string}
     * @default complete
     * @const
     * @static
     */
    static get COMPLETE (): string
    {
        return "complete";
    }

    /**
     * @description Event.DEACTIVATE 定数は、deactivate イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.DEACTIVATE constant defines the value
     *              of the type property of a deactivate event object.
     *
     * @return  {string}
     * @default deactivate
     * @const
     * @static
     */
    static get DEACTIVATE (): string
    {
        return "deactivate";
    }

    /**
     * @description Event.ENTER_FRAME 定数は、enterFrame イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.ENTER_FRAME constant defines the value
     *              of the type property of an enterFrame event object.
     *
     * @return  {string}
     * @default enterFrame
     * @const
     * @static
     */
    static get ENTER_FRAME (): string
    {
        return "enterFrame";
    }

    /**
     * @description Event.EXIT_FRAME 定数は、exitFrame イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.EXIT_FRAME constant defines the value
     *              of the type property of an exitFrame event object.
     *
     * @return  {string}
     * @default exitFrame
     * @const
     * @static
     */
    static get EXIT_FRAME (): string
    {
        return "exitFrame";
    }

    /**
     * @description Event.FRAME_CONSTRUCTED 定数は、frameConstructed イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.FRAME_CONSTRUCTED constant defines the value
     *              of the type property of an frameConstructed event object.
     *
     * @return  {string}
     * @default frameConstructed
     * @const
     * @static
     */
    static get FRAME_CONSTRUCTED (): string
    {
        return "frameConstructed";
    }

    /**
     * @description Event.FRAME_LABEL 定数は、frameLabel イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.FRAME_LABEL constant defines the value
     *              of the type property of an frameLabel event object.
     *
     * @return  {string}
     * @default frameLabel
     * @const
     * @static
     */
    static get FRAME_LABEL (): string
    {
        return "frameLabel";
    }

    /**
     * @description Event.INIT 定数は、init イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.INIT constant defines the value
     *              of the type property of an init event object.
     *
     * @return  {string}
     * @default frameConstructed
     * @const
     * @static
     */
    static get INIT (): string
    {
        return "init";
    }

    /**
     * @description Event.LOAD 定数は、load イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.LOAD constant defines the value
     *              of the type property of an load event object.
     *
     * @return  {string}
     * @default frameConstructed
     * @const
     * @static
     */
    static get LOAD (): string
    {
        return "load";
    }

    /**
     * @description Event.MOUSE_LEAVE 定数は、mouseLeave イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.MOUSE_LEAVE constant defines the value
     *              of the type property of a mouseLeave event object.
     *
     * @return  {string}
     * @default mouseLeave
     * @const
     * @static
     */
    static get MOUSE_LEAVE (): string
    {
        return "mouseLeave";
    }

    /**
     * @description Event.REMOVED 定数は、removed プロパティ（paste イベントオブジェクト）の値を定義します。
     *              The Event.REMOVED constant defines the value
     *              of the type property of a removed event object.
     *
     * @return  {string}
     * @default removed
     * @const
     * @static
     */
    static get REMOVED (): string
    {
        return "removed";
    }

    /**
     * @description Event.REMOVED_FROM_STAGE 定数は、removedFromStage イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.REMOVED_FROM_STAGE constant defines the value
     *              of the type property of a removedFromStage event object.
     *
     * @return  {string}
     * @default removedFromStage
     * @const
     * @static
     */
    static get REMOVED_FROM_STAGE (): string
    {
        return "removedFromStage";
    }

    /**
     * @description Event.RENDER 定数は、render イベントオブジェクトの
     *              type プロパティの値を定義します。
     *              The Event.RENDER constant defines the value
     *              of the type property of a render event object.
     *
     * @return {string}
     * @default render
     * @const
     * @static
     */
    static get RENDER (): string
    {
        return "render";
    }

    /**
     * @description Event.RESIZE 定数は、resize イベントオブジェクトの
     *              type プロパティの値を定義します。
     *              The Event.RESIZE constant defines the value
     *              of the type property of a resize event object.
     *
     * @return {string}
     * @default resize
     * @const
     * @static
     */
    static get RESIZE (): string
    {
        return "resize";
    }

    /**
     * @description Event.SCROLL 定数は、render イベントオブジェクトの
     *              type プロパティの値を定義します。
     *              The Event.SCROLL constant defines the value
     *              of the type property of a render event object.
     *
     * @return {string}
     * @default scroll
     * @const
     * @static
     */
    static get SCROLL (): string
    {
        return "scroll";
    }

    /**
     * @description Event.OPEN 定数は、render イベントオブジェクトの
     *              type プロパティの値を定義します。
     *              The Event.OPEN constant defines the value
     *              of the type property of a render event object.
     *
     * @return {string}
     * @default open
     * @const
     * @static
     */
    static get OPEN ()
    {
        return "open";
    }

    /**
     * @description Event.STOP 定数は、render イベントオブジェクトの
     *              type プロパティの値を定義します。
     *              The Event.STOP constant defines the value
     *              of the type property of a render event object.
     *
     * @return {string}
     * @default stop
     * @const
     * @static
     */
    static get STOP (): string
    {
        return "stop";
    }

    /**
     * @description Event.SOUND_COMPLETE 定数は、soundComplete イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.SOUND_COMPLETE constant defines the value
     *              of the type property of a soundComplete event object.
     *
     * @return {string}
     * @default render
     * @const
     * @static
     */
    static get SOUND_COMPLETE (): string
    {
        return "soundComplete";
    }

    /**
     * @description Event.UPDATE 定数は、render イベントオブジェクトの
     *              type プロパティの値を定義します。
     *              The Event.STOP constant defines the value
     *              of the type property of a render event object.
     *
     * @return {string}
     * @default update
     * @const
     * @static
     */
    static get UPDATE (): string
    {
        return "update";
    }

    /**
     * @description イベントがバブリングイベントかどうかを示します。
     *              Indicates whether an event is a bubbling event.
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    get bubbles (): boolean
    {
        return this._$bubbles;
    }

    /**
     * @description イベントに関連付けられた動作を回避できるかどうかを示します。
     *              Indicates whether the behavior associated
     *              with the event can be prevented.
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    get cancelable (): boolean
    {
        return this._$cancelable;
    }

    /**
     * @description イベントリスナーで Event オブジェクトをアクティブに処理しているオブジェクトです。
     *              The object that is actively processing the Event object
     *              with an event listener.
     *
     * @member {EventDispatcher|null}
     * @public
     */
    get currentTarget (): EventDispatcherImpl<any>
    {
        return this._$currentTarget as EventDispatcherImpl<any>;
    }
    set currentTarget (current_target: EventDispatcherImpl<any>)
    {
        this._$currentTarget = current_target;
    }

    /**
     * @description イベントフローの現在の段階です。
     *              The current phase in the event flow.
     *
     * @member {number}
     * @public
     */
    get eventPhase (): number
    {
        return this._$eventPhase;
    }
    set eventPhase (event_phase: number)
    {
        this._$eventPhase = event_phase;
    }

    /**
     * @description 現在コールされている関数
     *              Function currently being called.
     *
     * @member {function}
     * @public
     */
    get listener (): Function | null
    {
        return this._$listener;
    }
    set listener (listener: Function | null)
    {
        this._$listener = listener;
    }

    /**
     * @description イベントターゲットです。
     *              The event target.
     *
     * @member {EventDispatcher|null}
     * @public
     */
    get target (): EventDispatcherImpl<any>
    {
        return this._$target ? this._$target : this._$currentTarget;
    }
    set target (target: EventDispatcherImpl<any>)
    {
        this._$target = target;
    }

    /**
     * @description イベントのタイプです。
     *              The type of event.
     *
     * @member {string}
     * @readonly
     * @public
     */
    get type (): string
    {
        return this._$type;
    }

    /**
     * @description カスタム ActionScript 3.0 Event クラスに
     *              toString() メソッドを実装するためのユーティリティ関数です。
     *              A utility function for implementing the toString() method
     *              in custom ActionScript 3.0 Event classes.
     *
     * @return {string}
     * @method
     * @public
     */
    formatToString (...args: string[]): string
    {
        let str = `[${args[0]}`;

        for (let idx:number = 1; idx < args.length; ++idx) {

            // eslint-disable-next-line prefer-rest-params
            const name = args[idx];

            str += ` ${name}=`;

            // @ts-ignore
            const value = this[name];
            if (typeof value === "string") {
                str += `"${value}"`;
            } else {
                str += `${value}`;
            }

        }

        return `${str}]`;
    }

    /**
     * @description イベントフローの現在のノードおよび後続するノードで、
     *              イベントリスナーが処理されないようにします。
     *              Prevents processing of any event listeners in the current node
     *              and any subsequent nodes in the event flow.
     *
     * @return {void}
     * @method
     * @public
     */
    stopImmediatePropagation ()
    {
        this._$stopImmediatePropagation = true;
    }

    /**
     * @description イベントフローの現在のノードに後続するノードで
     *              イベントリスナーが処理されないようにします。
     *              Prevents processing of any event listeners in nodes subsequent
     *              to the current node in the event flow.
     *
     * @return {void}
     * @method
     * @public
     */
    stopPropagation ()
    {
        this._$stopPropagation = true;
    }
}