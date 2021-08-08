/**
 * ビデオを再生または停止すると、VideoEvent オブジェクトを送出します。
 *
 * When a video is played or stopped, it sends out a VideoEvent object.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
class VideoEvent extends Event
{
    /**
     * @param {string}  type
     * @param {boolean} [bubbles=true]
     * @param {boolean} [cancelable=false]
     * @param {number}  [bytes_loaded=0]
     * @param {number}  [bytes_total=0]
     *
     * @constructor
     * @public
     */
    constructor (
        type, bubbles = false, cancelable = false,
        bytes_loaded = 0, bytes_total = 0
    ) {

        super(type, bubbles, cancelable);

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bytesLoaded = bytes_loaded | 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bytesTotal  = bytes_total | 0;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class VideoEvent]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class VideoEvent]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events.VideoEvent
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.events.VideoEvent";
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
        return this.formatToString(
            "VideoEvent",
            "type", "bubbles", "cancelable", "bytes_loaded", "bytes_total"
        );
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events.VideoEvent
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.events.VideoEvent";
    }

    /**
     * @description progress イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a progress event object.
     *
     * @return {string}
     * @default progress
     * @const
     * @static
     */
    static get PROGRESS ()
    {
        return "progress";
    }

    /**
     * @description play イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a play event object.
     *
     * @return {string}
     * @default play
     * @const
     * @static
     */
    static get PLAY ()
    {
        return "play";
    }

    /**
     * @description playStart イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a playStart event object.
     *
     * @return {string}
     * @default playStart
     * @const
     * @static
     */
    static get PLAY_START ()
    {
        return "playStart";
    }

    /**
     * @description playEnd イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a playEnd event object.
     *
     * @return {string}
     * @default playEnd
     * @const
     * @static
     */
    static get PLAY_END ()
    {
        return "playEnd";
    }

    /**
     * @description pause イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a pause event object.
     *
     * @return {string}
     * @default pause
     * @const
     * @static
     */
    static get PAUSE ()
    {
        return "pause";
    }

    /**
     * @description seek イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a seek event object.
     *
     * @return {string}
     * @default seek
     * @const
     * @static
     */
    static get SEEK ()
    {
        return "seek";
    }

    /**
     * @description リスナーがイベントを処理しているときに読み込まれたアイテム数またはバイト数です。
     *              The number of items or bytes loaded when the listener processes the event.
     *
     * @return {number}
     * @default 0
     * @readonly
     * @public
     */
    get bytesLoaded ()
    {
        return this._$bytesLoaded;
    }

    /**
     * @description 読み込みプロセスが成功した場合に読み込まれるアイテムまたはバイトの総数です。
     *              The total number of items or bytes that will be loaded
     *              if the loading process succeeds.
     *
     * @return {number}
     * @default 0
     * @readonly
     * @public
     */
    get bytesTotal ()
    {
        return this._$bytesTotal;
    }
}