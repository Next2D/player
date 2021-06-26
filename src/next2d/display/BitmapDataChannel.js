/**
 * @class
 * @memberOf next2d.display
 */
class BitmapDataChannel
{
    /**
     * BitmapDataChannel クラスは、赤、青、緑、またはアルファ透明度の
     * いずれのチャンネルを使用するかを示す定数値の列挙です。
     * メソッドを呼び出すとき、ビット単位の OR 演算子（|）を使って
     * BitmapDataChannel 定数を結合すれば、複数のカラーチャンネルを指定することができます。
     *
     * The BitmapDataChannel class is an enumeration of constant values that indicate
     * which channel to use: red, blue, green, or alpha transparency.
     * When you call some methods, you can use the bitwise OR operator (|)
     * to combine BitmapDataChannel constants to indicate multiple color channels.
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
     * @default [class BitmapDataChannel]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class BitmapDataChannel]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.BitmapDataChannel
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display.BitmapDataChannel";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BitmapDataChannel]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BitmapDataChannel]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.BitmapDataChannel
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display.BitmapDataChannel";
    }

    /**
     * @description アルファチャンネルです。
     *              The alpha channel.
     *
     * @return  {number}
     * @default 8
     * @const
     * @static
     */
    static get ALPHA ()
    {
        return 8;
    }

    /**
     * @description 青チャンネルです。
     *              The blue channel.
     *
     * @return  {number}
     * @default 4
     * @const
     * @static
     */
    static get BLUE ()
    {
        return 4;
    }

    /**
     * @description 緑チャンネルです。
     *              The green channel.
     *
     * @return  {number}
     * @default 2
     * @const
     * @static
     */
    static get GREEN ()
    {
        return 2;
    }

    /**
     * @description 赤チャンネルです。
     *              The red channel.
     *
     * @return  {number}
     * @default 1
     * @const
     * @static
     */
    static get RED ()
    {
        return 1;
    }
}