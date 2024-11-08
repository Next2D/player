import type { EventDispatcher } from "./EventDispatcher";
import type { IEventDispatcher } from "./interface/IEventDispatcher";
import { EventPhase } from "./EventPhase";

/**
 * @description Event クラスのメソッドは、イベントリスナー関数で使用してイベントオブジェクトの動作に影響を与えることができます。
 *              一部のイベントにはデフォルトの動作が関連付けられています。
 *              例えば、doubleClick イベントには、イベント時にマウスポインター位置の単語がハイライト表示されるというデフォルトの動作が関連付けられています。
 *              イベントリスナーで preventDefault() メソッドを呼び出してこの動作をキャンセルできます。
 *              また、stopPropagation() メソッドまたは stopImmediatePropagation() メソッドを呼び出すと、
 *              現在のイベントリスナーを、イベントを処理する最後のイベントリスナーにすることができます。
 *
 *              The methods of the Event class can be used in event listener functions to affect the behavior of the event object.
 *              Some events have an associated default behavior. For example,
 *              the doubleClick event has an associated default behavior that highlights the word under the mouse pointer at the time of the event.
 *              Your event listener can cancel this behavior by calling the preventDefault() method.
 *              You can also make the current event listener the last one to process
 *              an event by calling the stopPropagation() or stopImmediatePropagation() method.
 *
 * @class
 * @memberOf next2d.events
 */
export class Event
{
    /**
     * @description イベントのタイプです。
     *              The type of event.
     *
     * @member {string}
     * @readonly
     * @public
     */
    public readonly type: string;

    /**
     * @description イベントがバブリングイベントかどうかを示します。
     *              Indicates whether an event is a bubbling event.
     *
     * @member {boolean}
     * @default false
     * @readonly
     * @public
     */
    public readonly bubbles: boolean;

    /**
     * @description 実行される関数
     *              The function to execute.
     *
     * @type {Function | null}
     * @default null
     * @public
     */
    public listener: Function | null;

    /**
     * @description イベント登録を行なったオブジェクト
     *              The object that registered the event.
     *
     * @type {EventDispatcher | null}
     * @default null
     * @public
     */
    public target: IEventDispatcher<EventDispatcher> | null;

    /**
     * @description イベントを発火したオブジェクト
     *              The object that fired the event.
     *
     * @type {EventDispatcher | null}
     * @default null
     * @public
     */
    public currentTarget: IEventDispatcher<EventDispatcher> | null;

    /**
     * @description イベントフェーズ
     *              Event phase.
     *
     * @see {EventPhase}
     * @type {number}
     * @default EventPhase.AT_TARGET
     * @public
     */
    public eventPhase: number;

    public _$stopImmediatePropagation: boolean;
    public _$stopPropagation: boolean;

    /**
     * @param {string}  type
     * @param {boolean} [bubbles=false]
     *
     * @constructor
     * @public
     */
    constructor (type: string, bubbles: boolean = false)
    {
        /**
         * @type {string}
         * @private
         */
        this.type = `${type}`;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this.bubbles = bubbles;

        /**
         * @type {EventDispatcher | null}
         * @default null
         * @private
         */
        this.target = null;

        /**
         * @type {EventDispatcher | null}
         * @default null
         * @private
         */
        this.currentTarget = null;

        /**
         * @type {number}
         * @default EventPhase.AT_TARGET
         * @private
         */
        this.eventPhase = EventPhase.AT_TARGET;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this.listener = null;

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
     * @description Sprite または MovieClip を親に持つオブジェクトに追加されたときに発生します。
     *              Occurs when the object is added to a parent object.
     *
     * @return {string}
     * @const
     * @static
     */
    static get ADDED (): string
    {
        return "added";
    }

    /**
     * @description Stage に追加されたときに発生します。
     *              Occurs when the object is added to the Stage.
     *
     * @return {string}
     * @const
     * @static
     */
    static get ADDED_TO_STAGE (): string
    {
        return "addedToStage";
    }

    /**
     * @description 読み込みや、処理完了時に発生します。
     *              Occurs when loading or processing is complete.
     *
     * @return {string}
     * @const
     * @static
     */
    static get COMPLETE (): string
    {
        return "complete";
    }

    /**
     * @description サウンドやビデオなどの再生処理の終了時に発生します。
     *              Occurs when playback of a sound or video ends.
     *
     * @return {string}
     * @const
     * @static
     */
    static get ENDED (): string
    {
        return "ended";
    }

    /**
     * @description MovieClip のフレームが変更される度に発生します。
     *              Occurs when the frame of a MovieClip changes.
     *
     * @return {string}
     * @const
     * @static
     */
    static get ENTER_FRAME (): string
    {
        return "enterFrame";
    }

    /**
     * @description MovieClip のフレームラベルのキーフレームに到達したときに発生します。
     *              Occurs when a MovieClip reaches a keyframe that designates a frame label.
     *
     * @return {string}
     * @const
     * @static
     */
    static get FRAME_LABEL (): string
    {
        return "frameLabel";
    }

    /**
     * @description データの読み込み開始時に発生します。
     *              Occurs when sound data loading starts.
     *
     * @return {string}
     * @default "soundopen"
     * @const
     * @static
     */
    static get OPEN (): string
    {
        return "open";
    }

    /**
     * @description Sprite または MovieClip を親に持つオブジェクトから削除されたときに発生します。
     *              Occurs when the object is removed from a parent object.
     *
     * @return {string}
     * @const
     * @static
     */
    static get REMOVED (): string
    {
        return "removed";
    }

    /**
     * @description Stage から削除されたときに発生します。
     *              Occurs when the object is removed from the Stage.
     *
     * @return {string}
     * @const
     * @static
     */
    static get REMOVED_FROM_STAGE (): string
    {
        return "removedFromStage";
    }

    /**
     * @description 画面のサイズが変更されたときに発生します。
     *              Occurs when the screen size changes.
     *
     * @return {string}
     * @const
     * @static
     */
    static get RESIZE (): string
    {
        return "resize";
    }

    /**
     * @description スクロール位置が変更されたときに発生します。
     *              Occurs when the scroll position changes.
     *
     * @return {string}
     * @const
     * @static
     */
    static get SCROLL (): string
    {
        return "scroll";
    }

    /**
     * @description イベントフローの現在のノードおよび後続するノードで、イベントリスナーが処理されないようにします。
     *              Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
     *
     * @return {void}
     * @method
     * @public
     */
    stopImmediatePropagation (): void
    {
        this._$stopImmediatePropagation = true;
    }

    /**
     * @description イベントフローの現在のノードに後続するノードで、イベントリスナーが処理されないようにします。
     *              Prevents processing of any event listeners in nodes subsequent to the current node in the event flow.
     *
     * @return {void}
     * @method
     * @public
     */
    stopPropagation (): void
    {
        this._$stopPropagation = true;
    }
}