/**
 * @class
 * @memberOf next2d.display
 */
class CapsStyle
{
    /**
     * CapsStyle クラスは、線の描画で使用されるキャップのスタイルを指定する定数値の列挙です。
     * この定数は、caps パラメーター（next2d.display.Graphics.lineStyle() メソッドのパラメーター）の値として使用されます。
     *
     * he CapsStyle class is an enumeration of constant values that specify the caps style to use in drawing lines.
     * The constants are provided for use as values in the caps parameter of the next2d.display.Graphics.lineStyle() method.
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
     * @default [class CapsStyle]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class CapsStyle]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.CapsStyle
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.CapsStyle";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object CapsStyle]
     * @method
     * @public
     */
    toString ()
    {
        return "[object CapsStyle]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.CapsStyle
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display.CapsStyle";
    }

    /**
     * @description flash.display.Graphics.lineStyle() メソッドの caps パラメーターで
     *              キャップなしを指定するのに使用します。
     *              Used to specify no caps in the caps parameter of the
     *              flash.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default none
     * @const
     * @static
     */
    static get NONE ()
    {
        return "none";
    }

    /**
     * @description flash.display.Graphics.lineStyle() メソッドの caps パラメーターで
     *              丸いキャップを指定するのに使用します。
     *              Used to specify round caps in the caps parameter of the
     *              flash.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default round
     * @const
     * @static
     */
    static get ROUND ()
    {
        return "round";
    }

    /**
     * @description flash.display.Graphics.lineStyle() メソッドの caps パラメーターで
     *              四角形のキャップを指定するのに使用します。
     *              Used to specify square caps in the caps parameter of the
     *              flash.display.Graphics.lineStyle() method.
     *
     * @return  {string}
     * @default square
     * @const
     * @static
     */
    static get SQUARE ()
    {
        return "square";
    }
}