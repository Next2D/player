/**
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
class FocusEvent extends Event
{
    /**
     * FocusEvent オブジェクトは、ユーザーが表示リストの1つのオブジェクトから
     * 別のオブジェクトにフォーカスを変更したときにオブジェクトによって送出されます。
     * 次の2種類のフォーカスイベントがあります。
     *
     * An object dispatches a FocusEvent object when the user changes
     * the focus from one object in the display list to another.
     * There are two types of focus events:
     *
     * <ul>
     *     <li>FocusEvent.FOCUS_IN</li>
     *     <li>FocusEvent.FOCUS_OUT</li>
     * </ul>
     *
     * @param {string}  type
     * @param {boolean} [bubbles=true]
     * @param {boolean} [cancelable=false]
     *
     * @constructor
     * @public
     */
    constructor (type, bubbles = true, cancelable = false)
    {
        super(type, bubbles, cancelable);

    }

    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class FocusEvent]
     * @method
     * @static
     */
    static toString()
    {
        return "[class FocusEvent]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default next2d.events.FocusEvent
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.events.FocusEvent";
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
            "FocusEvent", "type", "bubbles", "cancelable", "eventPhase"
        );
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default next2d.events.FocusEvent
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.events.FocusEvent";
    }

    /**
     * @description focusIn イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a focusIn event object.
     *
     * @return {string}
     * @default focusIn
     * @const
     * @static
     */
    static get FOCUS_IN ()
    {
        return "focusIn";
    }

    /**
     * @description focusOut イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a focusOut event object.
     *
     * @return {string}
     * @default focusOut
     * @const
     * @static
     */
    static get FOCUS_OUT ()
    {
        return "focusOut";
    }
}