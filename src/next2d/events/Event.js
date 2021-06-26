/**
 * @class
 * @memberOf next2d.events
 */
class Event
{
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
     * @param {string}  type
     * @param {boolean} [bubbles=false]
     * @param {boolean} [cancelable=false]
     *
     * @example <caption>Example usage of Event.</caption>
     * // new Event
     * const {Event} = next2d.events;
     * displayObject.dispatchEvent(new Event(Event.ENTER_FRAME));
     *
     * @constructor
     * @public
     */
    constructor (type, bubbles = false, cancelable = false)
    {
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
         * @type {object|null}
         * @private
         */
        this._$target = null;

        /**
         * @type {object|null}
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
         * @type {boolean}
         * @private
         */
        this._$stopImmediatePropagation = false;

        /**
         * @type {boolean}
         * @private
         */
        this._$stopPropagation = false;

        /**
         * @type {boolean}
         * @private
         */
        this._$preventDefault = false;
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
    static toString ()
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
    static get namespace ()
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
    toString ()
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
    get namespace ()
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
    static get ACTIVATE ()
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
    static get ADDED ()
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
    static get ADDED_TO_STAGE ()
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
    static get CHANGE ()
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
    static get COMPLETE ()
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
    static get DEACTIVATE ()
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
    static get ENTER_FRAME ()
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
    static get EXIT_FRAME ()
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
    static get FRAME_CONSTRUCTED ()
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
    static get FRAME_LABEL ()
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
    static get INIT ()
    {
        return "init";
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
    static get MOUSE_LEAVE ()
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
    static get REMOVED ()
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
    static get REMOVED_FROM_STAGE ()
    {
        return "removedFromStage";
    }

    /**
     * @description Event.REMOVED 定数は、render イベントオブジェクトの type プロパティの値を定義します。
     *              The Event.REMOVED constant defines the value
     *              of the type property of a render event object.
     *
     * @return {string}
     * @default render
     * @const
     * @static
     */
    static get RENDER ()
    {
        return "render";
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
    static get SCROLL ()
    {
        return "scroll";
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
    static get SOUND_COMPLETE ()
    {
        return "soundComplete";
    }

    /**
     * @description イベントがバブリングイベントかどうかを示します。
     *              Indicates whether an event is a bubbling event.
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    get bubbles ()
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
    get cancelable ()
    {
        return this._$cancelable;
    }

    /**
     * @description イベントリスナーで Event オブジェクトをアクティブに処理しているオブジェクトです。
     *              The object that is actively processing the Event object
     *              with an event listener.
     *
     * @member {object}
     * @readonly
     * @public
     */
    get currentTarget ()
    {
        return this._$currentTarget;
    }

    /**
     * @description イベントフローの現在の段階です。
     *              The current phase in the event flow.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get eventPhase ()
    {
        return this._$eventPhase;
    }

    /**
     * @description イベントターゲットです。
     *              The event target.
     *
     * @member {object}
     * @readonly
     * @public
     */
    get target ()
    {
        return (this._$target) ? this._$target : this._$currentTarget;
    }

    /**
     * @description イベントのタイプです。
     *              The type of event.
     *
     * @member {string}
     * @readonly
     * @public
     */
    get type ()
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
    formatToString ()
    {
        let str = `[${arguments[0]}`;

        for (let idx = 1; idx < arguments.length; ++idx) {

            const name = arguments[idx];

            str += ` ${name}=`;

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
     * @description イベントで preventDefault() メソッドが呼び出されたかどうかを確認します。
     *              Checks whether the preventDefault() method has been called on the event.
     *
     * @return {boolean}
     * @method
     * @public
     */
    isDefaultPrevented ()
    {
        return (Util.$event) ? Util.$event.defaultPrevented : false;
    }

    /**
     * @description イベントのデフォルト動作をキャンセルできる場合に、その動作をキャンセルします。
     *              Cancels an event's default behavior if that behavior can be canceled.
     *
     * @return {void}
     * @method
     * @public
     */
    preventDefault ()
    {
        this._$preventDefault = true;
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