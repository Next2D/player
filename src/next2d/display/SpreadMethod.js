/**
 * SpreadMethod クラスは、spreadMethod パラメーター（Graphics クラスの beginGradientFill() メソッド
 * および lineGradientStyle() メソッドのパラメーター）の値を提供します。
 *
 * The SpreadMethod class provides values for the spreadMethod parameter
 * in the beginGradientFill() and lineGradientStyle() methods of the Graphics class.
 *
 * @class
 * @memberOf next2d.display
 */
class SpreadMethod
{

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class SpreadMethod]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class SpreadMethod]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.SpreadMethod
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.SpreadMethod";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object SpreadMethod]
     * @method
     * @public
     */
    toString ()
    {
        return "[object SpreadMethod]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.SpreadMethod
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display.SpreadMethod";
    }

    /**
     * @description グラデーションで spread メソッド pad を使用することを指定します。
     *              Specifies that the gradient use the pad spread method.
     *
     * @return  {string}
     * @default pad
     * @const
     * @static
     */
    static get PAD ()
    {
        return "pad";
    }

    /**
     * @description グラデーションで spread メソッド reflect を使用することを指定します。
     *              Specifies that the gradient use the reflect spread method.
     *
     * @return  {string}
     * @default reflect
     * @const
     * @static
     */
    static get REFLECT ()
    {
        return "reflect";
    }

    /**
     * @description グラデーションで spread メソッド repeat を使用することを指定します。
     *              Specifies that the gradient use the repeat spread method.
     *
     * @return  {string}
     * @default repeat
     * @const
     * @static
     */
    static get REPEAT ()
    {
        return "repeat";
    }
}