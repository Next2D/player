/**
 * @class
 * @memberOf next2d.display
 */
class InterpolationMethod
{
    /**
     * InterpolationMethod クラスは、interpolationMethod パラメーター（Graphics.beginGradientFill()
     * および Graphics.lineGradientStyle() メソッドのパラメーター）の値を提供します。
     * このパラメーターは、グラデーションをレンダリングするときに使用する RGB スペースを決定します。
     *
     * The InterpolationMethod class provides values for the interpolationMethod parameter 
     * in the Graphics.beginGradientFill() and Graphics.lineGradientStyle() methods. 
     * This parameter determines the RGB space to use when rendering the gradient.
     *
     * @constructor
     * @public
     */
    constructor () {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class InterpolationMethod]
     * @method
     * @static
     */
    static toString()
    {
        return "[class InterpolationMethod]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.InterpolationMethod
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.InterpolationMethod";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object InterpolationMethod]
     * @method
     * @public
     */
    toString ()
    {
        return "[object InterpolationMethod]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.InterpolationMethod
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display.InterpolationMethod";
    }

    /**
     * @description 線形 RGB 補間メソッドを使用することを指定します。
     *              Specifies that the linear RGB interpolation method should be used.
     *
     * @return  {string}
     * @default linearRGB
     * @const
     * @static
     */
    static get LINEAR_RGB ()
    {
        return "linearRGB";
    }

    /**
     * @description RGB 補間メソッドを使用することを指定します。
     *              Specifies that the RGB interpolation method should be used.
     *
     * @return  {string}
     * @default rgb
     * @const
     * @static
     */
    static get RGB ()
    {
        return "rgb";
    }
}