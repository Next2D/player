/**
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObject
 */
class Bitmap extends DisplayObject
{
    /**
     *
     *
     * @param {BitmapData} [bitmap_data=null]
     * @param {boolean}    [smoothing=false]
     *
     * @constructor
     * @public
     */
    constructor(bitmap_data, smoothing = false)
    {
        super();
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Bitmap]
     * @method
     * @static
     */
    static toString()
    {
        return "[class Bitmap]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:Bitmap
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:Bitmap";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Bitmap]
     * @method
     * @public
     */
    toString ()
    {
        return "[object Bitmap]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:Bitmap
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:Bitmap";
    }
}