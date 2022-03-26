/**
 * LoopType クラスは、MovieClipのフレームヘッダーの移動方法を指定する定数値の列挙です。
 * これらの定数は、LoopConfigで利用されます。
 *
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
     * @description
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
     * @description
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
     * @description
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
     * @description
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
     * @description
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
