/**
 * @class
 * @memberOf next2d.filters
 */
class BitmapFilterQuality
{
    /**
     * BitmapFilterQuality クラスには、BitmapFilter オブジェクトのレンダリング品質を設定する値が含まれます。
     * The BitmapFilterQuality class contains values to set the rendering quality of a BitmapFilter object.
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
     * @default [class BitmapFilterQuality]
     * @method
     * @static
     */
    static toString()
    {
        return "[class BitmapFilterQuality]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.BitmapFilterQuality
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters.BitmapFilterQuality";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BitmapFilterQuality]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BitmapFilterQuality]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.BitmapFilterQuality
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.filters.BitmapFilterQuality";
    }

    /**
     * @description 低品質のフィルター設定を定義します。
     *              Defines the low quality filter setting.
     *
     * @return  {number}
     * @default 1
     * @const
     * @static
     */
    static get LOW ()
    {
        return 1;
    }

    /**
     * @description 標準品質のフィルター設定を定義します。
     *              Defines the medium quality filter setting.
     *
     * @return  {number}
     * @default 2
     * @const
     * @static
     */
    static get MEDIUM ()
    {
        return 2;
    }

    /**
     * @description 高品質のフィルター設定を定義します。
     *              Defines the high quality filter setting.
     *
     * @return  {number}
     * @default 3
     * @const
     * @static
     */
    static get HIGH ()
    {
        return 3;
    }
}