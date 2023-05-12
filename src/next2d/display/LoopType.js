/**
 * LoopType クラスは、MovieClipのフレームヘッダーの移動方法を指定する定数値の列挙です。
 * これらの定数は、LoopConfigで利用されます。
 *
 * The LoopType class is an enumeration of constant values
 * that specify how to move the frame header of a MovieClip,
 * These constants are used by LoopConfig.
 *
 * @class
 * @memberOf next2d.display
 */
class LoopType
{
    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class LoopType]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class LoopType]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.LoopType
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.LoopType";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object LoopType]
     * @method
     * @public
     */
    toString ()
    {
        return "[object LoopType]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.LoopType
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.display.LoopType";
    }

    /**
     * @description ループ設定でリピート再生を使用することを指定します。
     *              Specifies that repeat playback should be used in the loop settings.
     *
     * @return  {number}
     * @default 0
     * @const
     * @static
     */
    static get REPEAT ()
    {
        return 0;
    }

    /**
     * @description ループ設定で再生ヘッダーが指定した最終フレームに到達するとフレームを固定する設定を指定します。
     *              Specifies the setting to fix frames when the playback header reaches the specified final frame in the loop settings.
     *
     * @return  {number}
     * @default 1
     * @const
     * @static
     */
    static get NO_REPEAT ()
    {
        return 1;
    }

    /**
     * @description ループ設定でフレームを固定する設定を指定します。
     *              Specifies the setting for fixing frames in the loop setting.
     *
     * @return  {number}
     * @default 2
     * @const
     * @static
     */
    static get FIXED ()
    {
        return 2;
    }

    /**
     * @description ループ設定で再生ヘッダーが逆再生し、指定した開始フレームに到達するとフレームを固定する設定を指定します。
     *              Specifies the setting where the playback header plays backwards in the loop setting
     *              and fixes the frame when the specified start frame is reached.
     *
     * @return  {number}
     * @default 3
     * @const
     * @static
     */
    static get NO_REPEAT_REVERSAL ()
    {
        return 3;
    }

    /**
     * @description ループ設定でリピート逆再生を使用することを指定します。
     *              Specifies the use of repeat reverse playback in the loop settings.
     *
     * @return  {number}
     * @default 4
     * @const
     * @static
     */
    static get REPEAT_REVERSAL ()
    {
        return 4;
    }
}
