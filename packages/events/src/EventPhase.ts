/**
 * @description EventPhase クラスは、Event クラスの eventPhase プロパティの値を提供します。
 *              The EventPhase class provides values for the eventPhase property of the Event class.
 *
 * @class
 * @memberOf next2d.events
 */
export class EventPhase
{
    /**
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default "[class EventPhase]"
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class EventPhase]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default "next2d.events.EventPhase"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.events.EventPhase";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default "[object EventPhase]"
     * @method
     * @public
     */
    toString (): string
    {
        return "[object EventPhase]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default "next2d.events.EventPhase"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.events.EventPhase";
    }

    /**
     * @description ターゲット段階（イベントフローの 2 番目の段階）です。
     *              The target phase, which is the second phase of the event flow.
     *
     * @return  {number}
     * @default 2
     * @const
     * @static
     */
    static get AT_TARGET (): number
    {
        return 2;
    }

    /**
     * @description ターゲット段階（イベントフローの 2 番目の段階）です。
     *              The target phase, which is the second phase of the event flow.
     *
     * @return  {number}
     * @default 3
     * @const
     * @static
     */
    static get BUBBLING_PHASE (): number
    {
        return 3;
    }

    /**
     * @description キャプチャ段階（イベントフローの最初の段階）です。
     *              The capturing phase, which is the first phase of the event flow.
     *
     * @return  {number}
     * @default 1
     * @const
     * @static
     */
    static get CAPTURING_PHASE (): number
    {
        return 1;
    }
}