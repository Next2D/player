import { BitmapFilter } from "./BitmapFilter";
import { execute as convolutionFilterCanApplyFilterService } from "./ConvolutionFilter/service/ConvolutionFilterCanApplyFilterService";
import { execute as convolutionFilterToArrayService } from "./ConvolutionFilter/service/ConvolutionFilterToArrayService";
import { execute as convolutionFilterToNumberArrayService } from "./ConvolutionFilter/service/ConvolutionFilterToNumberArrayService";
import {
    $clamp,
    $convertColorStringToNumber
} from "./FilterUtil";

/**
 * @description ConvolutionFilter クラスを使用すると、マトリックス畳み込みフィルター効果を適用できます。
 *              畳み込みでは、入力イメージ内のピクセルを、隣接するピクセルと組み合わせて、イメージを作成します。
 *              畳み込みを使用すると、ぼかし、エッジ検出、シャープ、エンボス、ベベルなど、幅広いイメージ効果を実現できます。
 *
 *              The ConvolutionFilter class applies a matrix convolution filter effect.
 *              A convolution combines pixels in the input image with neighboring pixels to produce an image.
 *              A wide variety of image effects can be achieved through convolutions, including blurring,
 *              edge detection, sharpening, embossing, and beveling.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class ConvolutionFilter extends BitmapFilter
{
    /**
     * @description フィルター認識番号
     *              Filter Recognition Number
     *
     * @member {number}
     * @public
     */
    public $filterType: number = 3;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$matrixX: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$matrixY: number;

    /**
     * @type {array}
     * @default null
     * @private
     */
    private _$matrix: number[] | null;

    /**
     * @type {number}
     * @default 1
     * @private
     */
    private _$divisor: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$bias: number;

    /**
     * @type {boolean}
     * @default true
     * @private
     */
    private _$preserveAlpha: boolean;

    /**
     * @type {boolean}
     * @default true
     * @private
     */
    private _$clamp: boolean;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$color: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$alpha: number;

    /**
     * @param {number}  [matrix_x=0]
     * @param {number}  [matrix_y=0]
     * @param {array}   [matrix=null]
     * @param {number}  [divisor=1.0]
     * @param {number}  [bias=0.0]
     * @param {boolean} [preserve_alpha=true]
     * @param {boolean} [clamp=true]
     * @param {number}  [color=0]
     * @param {number}  [alpha=0.0]
     *
     * @constructor
     * @public
     */
    constructor (
        matrix_x: number = 0,
        matrix_y: number = 0,
        matrix: number[] | null = null,
        divisor: number = 1,
        bias: number = 0,
        preserve_alpha: boolean = true,
        clamp: boolean = true,
        color: number = 0,
        alpha: number = 0
    ) {

        super();

        // default
        this._$matrixX       = 0;
        this._$matrixY       = 0;
        this._$matrix        = null;
        this._$divisor       = 1;
        this._$bias          = 0;
        this._$preserveAlpha = true;
        this._$clamp         = true;
        this._$color         = 0;
        this._$alpha         = 0;

        // setup
        this.matrixX       = matrix_x;
        this.matrixY       = matrix_y;
        this.matrix        = matrix;
        this.divisor       = divisor;
        this.bias          = bias;
        this.preserveAlpha = preserve_alpha;
        this.clamp         = clamp;
        this.color         = color;
        this.alpha         = alpha;
    }

    /**
     * @description アルファ透明度の値です。
     *              The alpha transparency value for the color.
     *
     * @member  {number}
     * @default 4
     * @public
     */
    get alpha (): number
    {
        return this._$alpha;
    }
    set alpha (alpha: number)
    {
        alpha = $clamp(+alpha, 0, 1, 0);
        if (alpha === this._$alpha) {
            return ;
        }
        this._$alpha  = alpha;
        this.$updated = true;
    }

    /**
     * @description マトリックス変換の結果に加算するバイアス量です。
     *              The amount of bias to add to the result of the matrix transformation.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get bias (): number
    {
        return this._$bias;
    }
    set bias (bias: number)
    {
        bias |= 0;
        if (bias === this._$bias) {
            return ;
        }
        this._$bias   = bias;
        this.$updated = true;
    }

    /**
     * @description イメージをクランプする必要があるかどうかを示します。
     *              Indicates whether the image should be clamped.
     *
     * @member  {boolean}
     * @default true
     * @public
     */
    get clamp (): boolean
    {
        return this._$clamp;
    }
    set clamp (clamp: boolean)
    {
        clamp = !!clamp;
        if (clamp === this._$clamp) {
            return ;
        }
        this._$clamp  = clamp;
        this.$updated = true;
    }

    /**
     * @description ソースイメージの外にあるピクセルを置換する 16 進数のカラー値です。
     *              The hexadecimal color to substitute for pixels that are off the source image.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get color (): number
    {
        return this._$color;
    }
    set color (color: number)
    {
        color = $clamp(
            typeof color === "string"
                ? $convertColorStringToNumber(color)
                : color
            , 0, 0xffffff, 0
        );
        if (color === this._$color) {
            return ;
        }
        this._$color  = color;
        this.$updated = true;
    }

    /**
     * @description マトリックス変換中に使用する除数です。
     *              The divisor used during matrix transformation.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get divisor (): number
    {
        return this._$divisor;
    }
    set divisor (divisor: number)
    {
        divisor |= 0;
        if (divisor === this._$divisor) {
            return ;
        }
        this._$divisor = divisor;
        this.$updated = true;
    }

    /**
     * @description マトリックス変換に使用する値の配列です。
     *              An array of values used for matrix transformation.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get matrix (): number[] | null
    {
        return this._$matrix;
    }
    set matrix (matrix: number[] | null)
    {
        if (this._$matrix === matrix) {
            return ;
        }
        this._$matrix = matrix;
        this.$updated = true;
    }

    /**
     * @description マトリックスの x 次元 (マトリックスの列数) です。
     *              The x dimension of the matrix (the number of columns in the matrix).
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get matrixX (): number
    {
        return this._$matrixX;
    }
    set matrixX (matrix_x: number)
    {
        matrix_x = $clamp(matrix_x | 0, 0, 15, 0) | 0;
        if (matrix_x === this._$matrixX) {
            return ;
        }
        this._$matrixX = matrix_x;
        this.$updated  = true;
    }

    /**
     * @description マトリックスの y 次元（マトリックスの行数）です。
     *              The y dimension of the matrix (the number of rows in the matrix).
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get matrixY (): number
    {
        return this._$matrixY;
    }
    set matrixY (matrix_y: number)
    {
        matrix_y = $clamp(matrix_y | 0, 0, 15, 0) | 0;
        if (matrix_y === this._$matrixY) {
            return ;
        }
        this._$matrixY = matrix_y;
        this.$updated  = true;
    }

    /**
     * @description アルファチャンネルがフィルター効果なしで維持されるかどうか、またはカラーチャンネルだけではなく
     *              アルファチャンネルにも畳み込みフィルターが適用されるかどうかを示します。
     *              Indicates if the alpha channel is preserved without the filter effect or
     *              if the convolution filter is applied to the alpha channel as well as the color channels.
     *
     * @member  {boolean}
     * @default true
     * @public
     */
    get preserveAlpha (): boolean
    {
        return this._$preserveAlpha;
    }
    set preserveAlpha (preserve_alpha: boolean)
    {
        preserve_alpha = !!preserve_alpha;
        if (preserve_alpha === this._$preserveAlpha) {
            return ;
        }
        this._$preserveAlpha = preserve_alpha;
        this.$updated = true;
    }

    /**
     * @description オブジェクトのコピーを返します。
     *              Returns a copy of this filter object.
     *
     * @return {ConvolutionFilter}
     * @method
     * @public
     */
    clone (): ConvolutionFilter
    {
        return new ConvolutionFilter(
            this._$matrixX, this._$matrixY, this._$matrix ? this._$matrix.slice() : null,
            this._$divisor, this._$bias, this._$preserveAlpha,
            this._$clamp, this._$color, this._$alpha
        );
    }

    /**
     * @description 設定されたフィルターの値を配列で返します。
     *              Returns the value of the specified filter as an array.
     *
     * @return {array}
     * @method
     * @public
     */
    toArray (): Array<number | number[] | boolean | null>
    {
        return convolutionFilterToArrayService(this);
    }

    /**
     * @description 設定されたフィルターの値を数値配列で返します。
     *              Returns the value of the specified filter as a number array.
     *
     * @return {number[]}
     * @method
     * @public
     */
    toNumberArray (): number[]
    {
        return convolutionFilterToNumberArrayService(this);
    }

    /**
     * @description フィルターを適用できるかどうかを返します。
     *              Returns whether the filter can be applied.
     *
     * @return {boolean}
     * @method
     * @public
     */
    canApplyFilter (): boolean
    {
        return convolutionFilterCanApplyFilterService(this);
    }
}