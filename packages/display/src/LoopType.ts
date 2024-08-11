/**
 * @description LoopType クラスは、MovieClipのフレームヘッダーの移動方法を指定する定数値の列挙です。
 *              これらの定数は、LoopConfigで利用されます。
 *
 *              The LoopType class is an enumeration of constant values
 *              that specify how to move the frame header of a MovieClip,
 *              These constants are used by LoopConfig.
 *
 * @class
 * @memberOf next2d.display
 */
export class LoopType
{
    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return {string}
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.LoopType";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return {string}
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.LoopType";
    }

    /**
     * @description ループ設定でリピート再生を使用することを指定します。
     *              Specifies that repeat playback should be used in the loop settings.
     *
     * @return {number}
     * @const
     * @static
     */
    static get REPEAT (): number
    {
        return 0;
    }

    /**
     * @description ループ設定で再生ヘッダーが指定した最終フレームに到達するとフレームを固定する設定を指定します。
     *              Specifies the setting to fix frames when the playback header reaches the specified final frame in the loop settings.
     *
     * @return {number}
     * @const
     * @static
     */
    static get NO_REPEAT (): number
    {
        return 1;
    }

    /**
     * @description ループ設定でフレームを固定する設定を指定します。
     *              Specifies the setting for fixing frames in the loop setting.
     *
     * @return {number}
     * @const
     * @static
     */
    static get FIXED (): number
    {
        return 2;
    }

    /**
     * @description ループ設定で再生ヘッダーが逆再生し、指定した開始フレームに到達するとフレームを固定する設定を指定します。
     *              Specifies the setting where the playback header plays backwards in the loop setting
     *              and fixes the frame when the specified start frame is reached.
     *
     * @return {number}
     * @const
     * @static
     */
    static get NO_REPEAT_REVERSAL (): number
    {
        return 3;
    }

    /**
     * @description ループ設定でリピート逆再生を使用することを指定します。
     *              Specifies the use of repeat reverse playback in the loop settings.
     *
     * @return {number}
     * @const
     * @static
     */
    static get REPEAT_REVERSAL (): number
    {
        return 4;
    }
}
