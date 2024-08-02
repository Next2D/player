import type { BitmapData } from "./BitmapData";
import type { Matrix } from "@next2d/geom";

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
export class GraphicsBitmapFill
{
    private readonly _$bitmapData: BitmapData;
    private readonly _$matrix: Matrix | null;
    private readonly _$repeat: boolean;
    private readonly _$smooth: boolean;

    /**
     * @param {BitmapData} bitmap_data
     * @param {Matrix}     [matrix=null]
     * @param {boolean}    [repeat=true]
     * @param {boolean}    [smooth=false]
     *
     * @constructor
     * @private
     */
    constructor (
        bitmap_data: BitmapData,
        matrix: Matrix | null = null,
        repeat: boolean = true,
        smooth: boolean = false
    ) {

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
         * @default true
         * @private
         */
        this._$repeat = repeat;

        /**
         * @description ビットマップイメージにスムージングアルゴリズムを適用するかどうかを指定します。
         *              Specifies whether to apply a smoothing algorithm to the bitmap image.
         *
         * @type {boolean}
         * @default false
         * @private
         */
        this._$smooth = smooth;
    }

    /**
     * @description 新しいオブジェクトとして、このクラスのクローンを返します。
     *              含まれるオブジェクトはまったく同じコピーになります。
     *              Returns a clone of this class as a new object,
     *              with an exact copy of the contained object.
     *
     * @return {GraphicsBitmapFill}
     * @method
     * @public
     */
    clone (): GraphicsBitmapFill
    {
        return new GraphicsBitmapFill(
            this._$bitmapData.clone(),
            this._$matrix ? this._$matrix.clone() : null,
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
        return $getArray(
            this._$bitmapData,
            this._$matrix,
            this._$repeat,
            this._$smooth
        );
    }
}