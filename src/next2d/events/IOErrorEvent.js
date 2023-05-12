/**
 * IOErrorEvent オブジェクトは、エラーが発生して入力操作または出力操作が失敗したときに送出されます。
 *
 * An IOErrorEvent object is dispatched when an error causes input or output operations to fail.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
class IOErrorEvent extends Event
{
    /**
     * @param {string}  type
     * @param {boolean} [bubbles=true]
     * @param {boolean} [cancelable=false]
     * @param {string}  [text=""]
     *
     * @constructor
     * @public
     */
    constructor (type, bubbles = false, cancelable = false, text = "")
    {
        super(type, bubbles, cancelable);

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$text = `${text}`;
    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class IOErrorEvent]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class IOErrorEvent]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events.IOErrorEvent
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.events.IOErrorEvent";
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
            "IOErrorEvent",
            "type", "bubbles", "cancelable",
            "eventPhase", "text"
        );
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events.IOErrorEvent
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.events.IOErrorEvent";
    }

    /**
     * @description ioError イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of an ioError event object.
     *
     * @return {string}
     * @default ioError
     * @const
     * @static
     */
    static get IO_ERROR ()
    {
        return "ioError";
    }

    /**
     * @description エラーテキストです。
     *              error text.
     *
     * @return {string}
     * @default ""
     * @readonly
     * @public
     */
    get text ()
    {
        return this._$text;
    }
}