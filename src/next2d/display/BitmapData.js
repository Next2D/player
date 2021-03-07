/**
 * @class
 * @memberOf next2d.display
 */
class BitmapData
{
    /**
     *
     *
     * @param   {number}  [width=0]
     * @param   {number}  [height=0]
     * @param   {boolean} [transparent=true]
     * @param   {number}  [color=0xffffffff]
     *
     * @constructor
     * @public
     */
    constructor(width = 0, height = 0, transparent = true, color = 0xffffffff)
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = width|0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = height|0;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$transparent = transparent;

        /**
         * @type {number}
         * @default 0xffffffff
         * @private
         */
        this._$color = color;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class BitmapData]
     * @method
     * @static
     */
    static toString()
    {
        return "[class BitmapData]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:BitmapData
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:BitmapData";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BitmapData]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BitmapData]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:BitmapData
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:BitmapData";
    }

    /**
     * @description ビットマップイメージの高さ（ピクセル単位）です。
     *              The height of the bitmap image in pixels.
     *
     * @return  {number}
     * @readonly
     * @public
     */
    get height ()
    {
        return this._$height;
    }

    /**
     * @description ビットマップイメージがピクセル単位の透明度をサポートするかどうかを定義します。
     *              Defines whether the bitmap image supports per-pixel transparency.
     *
     * @return  {boolean}
     * @readonly
     * @public
     */
    get transparent ()
    {
        return this._$transparent;
    }

    /**
     * @description ビットマップイメージの幅（ピクセル単位）です。
     *              The width of the bitmap image in pixels.
     *
     * @return  {number}
     * @readonly
     * @public
     */
    get width ()
    {
        return this._$width;
    }


    snapShot ()
    {

    }

    load ()
    {

    }



}