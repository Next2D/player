/**
 * GradientType クラスは、type パラメーター（next2d.display.Graphics クラスの beginGradientFill() メソッドおよび
 * lineGradientStyle() メソッド内のパラメーター）に値を提供します。
 *
 * The GradientType class provides values for the type parameter in the beginGradientFill()
 * and lineGradientStyle() methods of the flash.display.Graphics class.
 *
 * @class
 * @memberOf next2d.display
 */
class GradientType
{
    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class GradientType]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class GradientType]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.GradientType
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.GradientType";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object GradientType]
     * @method
     * @public
     */
    toString ()
    {
        return "[object GradientType]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.GradientType
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display.GradientType";
    }

    /**
     * @description 線状グラデーションの塗りを指定する値です。
     *              Value used to specify a linear gradient fill.
     *
     * @return  {string}
     * @default linear
     * @const
     * @static
     */
    static get LINEAR ()
    {
        return "linear";
    }

    /**
     * @description 放射状グラデーションの塗りを指定する値です。
     *              Value used to specify a radial gradient fill.
     *
     * @return  {string}
     * @default radial
     * @const
     * @static
     */
    static get RADIAL ()
    {
        return "radial";
    }
}