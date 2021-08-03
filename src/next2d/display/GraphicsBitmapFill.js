/**
 * @class
 * @private
 */
class GraphicsBitmapFill
{
    /**
     * @param {BitmapData} [bitmap_data=null]
     * @param {Matrix}     [matrix=null]
     * @param {boolean}    [repeat=false]
     * @param {boolean}    [smooth=false]
     *
     * @constructor
     * @private
     */
    constructor (
        bitmap_data, matrix = null, repeat = false, smooth = false
    ) {
        /**
         * @type {BitmapData}
         * @default null
         * @private
         */
        this._$bitmapData = null;

        /**
         * @type {Matrix}
         * @default null
         * @private
         */
        this._$matrix = null;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$repeat = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$smooth = false;

        // set params
        this.bitmapData = bitmap_data;
        this.matrix     = matrix;
        this.repeat     = repeat;
        this.smooth     = smooth;
    }

    /**
     * @description 透明または不透明なビットマップイメージです。
     *              A transparent or opaque bitmap image.
     *
     * @member  {BitmapData}
     * @public
     */
    get bitmapData ()
    {
        return this._$bitmapData;
    }
    set bitmapData (bitmap_data)
    {
        this._$bitmapData = null;
        if (bitmap_data instanceof BitmapData) {
            this._$bitmapData = bitmap_data;
        }
    }

    /**
     * @description ビットマップ上の変形を定義する、
     *              （next2d.geom.Matrix クラスの）マトリックスオブジェクトです。
     *              A matrix object (of the next2d.geom.Matrix class)
     *              that defines transformations on the bitmap.
     *
     * @member  {Matrix}
     * @default null
     * @public
     */
    get matrix ()
    {
        return this._$matrix;
    }
    set matrix (matrix)
    {
        this._$matrix = null;
        if (matrix instanceof Matrix) {
            this._$matrix = matrix;
        }
    }

    /**
     * @description ビットマップイメージを一定のパターンでタイル状に表示するかどうかを指定します。
     *              Specifies whether to repeat the bitmap image in a tiled pattern.
     *
     * @member  {boolean}
     * @default false
     * @public
     */
    get repeat ()
    {
        return this._$repeat;
    }
    set repeat (repeat)
    {
        this._$repeat = repeat;
    }

    /**
     * @description ビットマップイメージにスムージングアルゴリズムを適用するかどうかを指定します。
     *              Specifies whether to apply a smoothing algorithm to the bitmap image.
     *
     * @member  {boolean}
     * @default false
     * @public
     */
    get smooth ()
    {
        return this._$smooth;
    }
    set smooth (smooth)
    {
        this._$smooth = smooth;
    }

    /**
     * @description このクラスのもつパラメーターを全てコピーする
     *              Copy all the parameters of this class
     *
     * @return {GraphicsBitmapFill}
     * @method
     * @public
     */
    clone ()
    {
        return new GraphicsBitmapFill(
            this._$bitmapData,
            (this._$matrix) ? this._$matrix.clone() : null,
            this._$repeat,
            this._$smooth
        );
    }

    /**
     * @description このクラスのもつパラメーターをArrayで返却する
     *              Return the parameters of this class as an Array.
     *
     * @return {array}
     * @method
     * @public
     */
    toArray ()
    {
        const buffer = this._$bitmapData._$buffer
            ? this._$bitmapData._$buffer
            : this._$bitmapData.toUint8Array();

        const matrix = (this._$matrix)
            ? this._$matrix._$matrix
            : Util.$MATRIX_ARRAY_IDENTITY;

        return Util.$getArray(
            this._$bitmapData.width,
            this._$bitmapData.height,
            buffer,
            matrix,
            (this._$repeat) ? "repeat" : "no-repeat",
            this._$smooth
        );
    }
}