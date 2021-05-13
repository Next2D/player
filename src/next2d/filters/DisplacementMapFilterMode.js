/**
 * @class
 * @memberOf next2d.filters
 */
class DisplacementMapFilterMode
{
    /**
     * DisplacementMapFilterMode クラスは DisplacementMapFilter クラスの mode プロパティの値を提供します。
     * The DisplacementMapFilterMode class provides values for the mode property of the DisplacementMapFilter class.
     *
     * @constructor
     * @public
     */
    constructor() {}

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class DisplacementMapFilterMode]
     * @method
     * @static
     */
    static toString()
    {
        return "[class DisplacementMapFilterMode]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters:DisplacementMapFilterMode
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters:DisplacementMapFilterMode";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object DisplacementMapFilterMode]
     * @method
     * @public
     */
    toString ()
    {
        return "[object DisplacementMapFilterMode]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters:DisplacementMapFilterMode
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.filters:DisplacementMapFilterMode";
    }

    /**
     * @description 置き換え値をソースイメージのエッジに固定します。
     *              Clamps the displacement value to the edge of the source image.
     *
     * @return  {string}
     * @default clamp
     * @const
     * @static
     */
    static get CLAMP ()
    {
        return "clamp";
    }

    /**
     * @description 置き換え値がイメージの外にある場合、color プロパティと
     *              alpha プロパティの値を置き換えます。
     *              If the displacement value is outside the image,
     *              substitutes the values in the color and alpha properties.
     *
     * @return  {string}
     * @default color
     * @const
     * @static
     */
    static get COLOR ()
    {
        return "color";
    }

    /**
     * @description 置き換え値が範囲外である場合、その置き換えを無視して、
     *              ソースピクセルを使用します。
     *              If the displacement value is out of range,
     *              ignores the displacement and uses the source pixel.
     *
     * @return  {string}
     * @default ignore
     * @const
     * @static
     */
    static get IGNORE ()
    {
        return "ignore";
    }

    /**
     * @description 置き換え値をソースイメージの反対側で折り返します。
     *              Wraps the displacement value to the other side of the source image.
     *
     * @return  {string}
     * @default wrap
     * @const
     * @static
     */
    static get WRAP ()
    {
        return "wrap";
    }
}