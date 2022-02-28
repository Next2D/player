/**
 * BitmapFilterType クラスには、BitmapFilter の型を設定する値が含まれます。
 * The BitmapFilterType class contains values to set the type of a BitmapFilter.
 *
 * @class
 * @memberOf next2d.filters
 */
class BitmapFilterType
{

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class BitmapFilterType]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class BitmapFilterType]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.BitmapFilterType
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters.BitmapFilterType";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BitmapFilterType]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BitmapFilterType]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.BitmapFilterType
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.filters.BitmapFilterType";
    }

    /**
     * @description オブジェクトの領域全体にフィルターを適用する設定を定義します。
     *              Defines the setting that applies a filter to the entire area of an object.
     *
     * @return  {string}
     * @default full
     * @const
     * @static
     */
    static get FULL ()
    {
        return "full";
    }

    /**
     * @description オブジェクトの内側の領域にフィルターを適用する設定を定義します。
     *              Defines the setting that applies a filter to the inner area of an object.
     *
     * @return  {string}
     * @default inner
     * @const
     * @static
     */
    static get INNER ()
    {
        return "inner";
    }

    /**
     * @description オブジェクトの外側の領域にフィルターを適用する設定を定義します。
     *              Defines the setting that applies a filter to the outer area of an object.
     *
     * @return  {string}
     * @default outer
     * @const
     * @static
     */
    static get OUTER ()
    {
        return "outer";
    }
}
