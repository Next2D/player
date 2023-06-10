import type { Matrix } from "../geom/Matrix";
import type { ColorStopImpl } from "../../../interface/ColorStopImpl";
import { $MATRIX_ARRAY_RATIO_0_0_RATIO_0_0 } from "../../util/Util";
import {
    GradientType,
    SpreadMethod,
    InterpolationMethod
} from "../../../interface/GradientTypeImpl";
import {
    $getArray,
    $intToRGBA,
    $Math
} from "../../util/RenderUtil";

/**
 * グラデーション塗りを定義します。
 * Defines a gradient fill.
 *
 * @class
 * @memberOf next2d.display
 * @private
 */
export class GraphicsGradientFill
{
    private readonly _$type: GradientType;
    private readonly _$colors: number[];
    private readonly _$alphas: number[];
    private readonly _$ratios: number[];
    private readonly _$matrix: Matrix | null;
    private readonly _$spreadMethod: SpreadMethod;
    private readonly _$interpolationMethod: InterpolationMethod;
    private readonly _$focalPointRatio: number;
    private readonly _$colorStops: ColorStopImpl[];

    /**
     * @param  {string} [type=GradientType.LINEAR]
     * @param  {array}  [colors=null]
     * @param  {array}  [alphas=null]
     * @param  {array}  [ratios=null]
     * @param  {Matrix} [matrix=null]
     * @param  {string} [spread_method=SpreadMethod.PAD]
     * @param  {string} [interpolation_method=InterpolationMethod.RGB]
     * @param  {number} [focal_point_ratio=0]
     *
     * @constructor
     * @private
     */
    constructor (
        type: GradientType,
        colors: number[], alphas: number[], ratios: number[],
        matrix: Matrix | null = null,
        spread_method: SpreadMethod = "pad",
        interpolation_method: InterpolationMethod = "rgb",
        focal_point_ratio: number = 0
    ) {

        /**
         * @description 使用するグラデーションのタイプを指定する GradientType クラスの値です。
         *              A value from the GradientType class that specifies which gradient type to use.
         *
         * @type {string}
         * @default GradientType.LINEAR
         * @private
         */
        this._$type = type;

        /**
         * @description グラデーションで使用する RGB 16 進数カラー値の配列です。
         *              An array of RGB hexadecimal color values to use in the gradient.
         *
         * @type {array}
         * @private
         */
        this._$colors = colors;

        /**
         * @description colors 配列内の各色に対応するアルファ値の配列です。
         *              An array of alpha values for the corresponding colors in the colors array.
         *
         * @type {array}
         * @private
         */
        this._$alphas = alphas;

        /**
         * @description 色分布の比率の配列です。
         *              An array of color distribution ratios.
         *
         * @type {array}
         * @private
         */
        this._$ratios = ratios;

        /**
         * @description Matrix クラスで定義される変換マトリックスです。
         *              A transformation matrix as defined by the Matrix class.
         *
         * @type {Matrix}
         * @default null
         * @private
         */
        this._$matrix = matrix;

        /**
         * @description 使用する spread メソッドを指定する SpreadMethod クラスの値です。
         *              A value from the SpreadMethod class that specifies which spread method to use.
         *
         * @type {string}
         * @default SpreadMethod.PAD
         * @private
         */
        this._$spreadMethod = spread_method;

        /**
         * @description 使用する値を指定する InterpolationMethod クラスの値です。
         *              A value from the InterpolationMethod class that specifies which value to use.
         *
         * @type {string}
         * @default InterpolationMethod.RGB
         * @private
         */
        this._$interpolationMethod = interpolation_method;

        /**
         * @description グラデーションの焦点の位置を制御する数値です。
         *              A number that controls the location
         *              of the focal point of the gradient.
         *
         * @type {number}
         * @default null
         * @private
         */
        this._$focalPointRatio = focal_point_ratio;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$colorStops = $getArray();
    }

    /**
     * @description 分配された色の情報を統合して配列で返却
     *              Integrate the distributed color information and return it in an array.
     *
     * @member  {array}
     * @default null
     * @readonly
     * @public
     */
    get colorStops ()
    {
        if (!this._$colorStops.length) {

            const length: number = $Math.min(
                $Math.min(this._$alphas.length, this._$colors.length),
                this._$ratios.length
            );

            for (let idx: number = 0; idx < length; ++idx) {

                const object = $intToRGBA(
                    this._$colors[idx], this._$alphas[idx]
                );

                this._$colorStops[idx] = {
                    "ratio": this._$ratios[idx] / 255,
                    "R": object.R,
                    "G": object.G,
                    "B": object.B,
                    "A": object.A
                };

            }
        }

        return this._$colorStops;
    }

    /**
     * @description このクラスのもつパラメーターをArrayで返却する
     *              Return the parameters of this class as an Array.
     *
     * @return {array}
     * @method
     * @public
     */
    toArray (): any[]
    {
        return $getArray(
            this._$type,
            this.colorStops,
            this._$matrix
                ? this._$matrix._$matrix
                : $MATRIX_ARRAY_RATIO_0_0_RATIO_0_0,
            this._$spreadMethod,
            this._$interpolationMethod,
            this._$focalPointRatio
        );
    }

    /**
     * @description 新しい GraphicsGradientFill オブジェクトとして、クローンを返します。
     *              含まれるオブジェクトはまったく同じコピーになります。
     *              Returns a clone as a new GraphicsGradientFill object.
     *              The contained object will be an exact copy.
     *
     * @return {GraphicsGradientFill}
     * @method
     * @public
     */
    clone (): GraphicsGradientFill
    {
        return new GraphicsGradientFill(this._$type,
            this._$colors.slice(), this._$alphas.slice(), this._$ratios.slice(),
            this._$matrix ? this._$matrix.clone() : null,
            this._$spreadMethod, this._$interpolationMethod,
            this._$focalPointRatio
        );
    }
}