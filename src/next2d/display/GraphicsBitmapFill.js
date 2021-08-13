/**
 * ビットマップ塗りを定義します。ビットマップは、スムージング、繰り返し、
 * またはタイリング表示して領域を塗りつぶしたり、変換マトリックスを使用して操作できます。
 *
 * Defines a bitmap fill. The bitmap can be smoothed,
 * repeated or tiled to fill the area; or manipulated using a transformation matrix.
 *
 * @class
 * @memberOf next2d.display
 * @private
 */
class GraphicsBitmapFill
{
    /**
     * @param {BitmapData} bitmap_data
     * @param {Matrix}     [matrix=null]
     * @param {boolean}    [repeat=false]
     * @param {boolean}    [smooth=false]
     *
     * @constructor
     * @private
     */
    constructor (bitmap_data, matrix = null, repeat = false, smooth = false)
    {
        /**
         * @description 透明または不透明なビットマップイメージです。
         *              A transparent or opaque bitmap image.
         *
         * @type {BitmapData}
         * @private
         */
        this._$bitmapData = bitmap_data;

        /**
         * @description ビットマップ上の変形を定義する、
         *              （next2d.geom.Matrix クラスの）マトリックスオブジェクトです。
         *              A matrix object (of the next2d.geom.Matrix class)
         *              that defines transformations on the bitmap.
         *
         * @type {Matrix}
         * @default null
         * @private
         */
        this._$matrix = matrix;

        /**
         * @description ビットマップイメージを一定のパターンでタイル状に表示するかどうかを指定します。
         *              Specifies whether to repeat the bitmap image in a tiled pattern.
         *
         * @type {boolean}
         * @default false
         * @private
         */
        this._$repeat = !!repeat;

        /**
         * @description ビットマップイメージにスムージングアルゴリズムを適用するかどうかを指定します。
         *              Specifies whether to apply a smoothing algorithm to the bitmap image.
         *
         * @type {boolean}
         * @default false
         * @private
         */
        this._$smooth = !!smooth;
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

        const matrix = this._$matrix
            ? this._$matrix._$matrix
            : Util.$MATRIX_ARRAY_IDENTITY;

        return Util.$getArray(
            this._$bitmapData.width,
            this._$bitmapData.height,
            buffer,
            matrix,
            this._$repeat ? "repeat" : "no-repeat",
            this._$smooth
        );
    }
}