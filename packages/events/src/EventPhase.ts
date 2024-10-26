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