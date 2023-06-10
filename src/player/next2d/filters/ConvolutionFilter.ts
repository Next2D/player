import { BitmapFilter } from "./BitmapFilter";
import { Rectangle } from "../geom/Rectangle";
import { CanvasToWebGLContext } from "../../../webgl/CanvasToWebGLContext";
import { AttachmentImpl } from "../../../interface/AttachmentImpl";
import { FrameBufferManager } from "../../../webgl/FrameBufferManager";
import {
    $Array,
    $clamp,
    $getArray,
    $poolArray,
    $toColorInt,
    $intToR,
    $intToG,
    $intToB
} from "../../util/RenderUtil";

/**
 * ConvolutionFilter クラスを使用すると、マトリックス畳み込みフィルター効果を適用できます。
 * 畳み込みでは、入力イメージ内のピクセルを、隣接するピクセルと組み合わせて、イメージを作成します。
 * 畳み込みを使用すると、ぼかし、エッジ検出、シャープ、エンボス、ベベルなど、幅広いイメージ効果を実現できます。
 *
 * The ConvolutionFilter class applies a matrix convolution filter effect.
 * A convolution combines pixels in the input image with neighboring pixels to produce an image.
 * A wide variety of image effects can be achieved through convolutions, including blurring,
 * edge detection, sharpening, embossing, and beveling.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class ConvolutionFilter extends BitmapFilter
{
    private _$matrixX: number;
    private _$matrixY: number;
    private _$matrix: number[] | null;
    private _$divisor: number;
    private _$bias: number;
    private _$preserveAlpha: boolean;
    private _$clamp: boolean;
    private _$color: number;
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
        matrix_x: number = 0, matrix_y: number = 0,
        matrix: number[] | null = null, divisor: number = 1,
        bias: number = 0, preserve_alpha: boolean = true,
        clamp: boolean = true, color: number = 0, alpha: number = 0
    ) {

        super();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$matrixX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$matrixY = 0;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$matrix = null;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$divisor = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bias = 0;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$preserveAlpha = true;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$clamp = true;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$color = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$alpha = 0;

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
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class ConvolutionFilter]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class ConvolutionFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.ConvolutionFilter
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.filters.ConvolutionFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object ConvolutionFilter]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object ConvolutionFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.ConvolutionFilter
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.filters.ConvolutionFilter";
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
        if (alpha !== this._$alpha) {
            this._$doChanged();
        }
        this._$alpha = alpha;
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
        if (bias !== this._$bias) {
            this._$doChanged();
        }
        this._$bias = bias;
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
        if (clamp !== this._$clamp) {
            this._$doChanged();
        }
        this._$clamp = clamp;
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
            $toColorInt(color), 0, 0xffffff, 0
        );

        if (color !== this._$color) {
            this._$doChanged();
        }

        this._$color = color;
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
        if (divisor !== this._$divisor) {
            this._$doChanged();
        }
        this._$divisor = divisor;
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
        this._$doChanged();

        if (this._$matrix) {
            $poolArray(this._$matrix);
        }

        // default
        this._$matrix = $Array.isArray(matrix) ? matrix : null;
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
        if (matrix_x !== this._$matrixX) {
            this._$doChanged();
        }
        this._$matrixX = matrix_x;
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
        if (matrix_y !== this._$matrixY) {
            this._$doChanged();
        }
        this._$matrixY = matrix_y;
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
        if (preserve_alpha !== this._$preserveAlpha) {
            this._$doChanged();
        }
        this._$preserveAlpha = preserve_alpha;
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
            this._$matrixX, this._$matrixY, this._$matrix,
            this._$divisor, this._$bias, this._$preserveAlpha,
            this._$clamp, this._$color, this._$alpha
        );
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    _$toArray (): any[]
    {
        return $getArray(3,
            this._$matrixX, this._$matrixY, this._$matrix,
            this._$divisor, this._$bias, this._$preserveAlpha,
            this._$clamp, this._$color, this._$alpha
        );
    }

    /**
     * @param  {Rectangle} rect
     * @return {Rectangle}
     * @method
     * @private
     */
    _$generateFilterRect (rect: Rectangle): Rectangle
    {
        return rect;
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply (): boolean
    {
        return this._$matrix !== null
            && this._$matrixX * this._$matrixY === this._$matrix.length;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$applyFilter (context: CanvasToWebGLContext): WebGLTexture
    {
        this._$updated = false;

        const manager: FrameBufferManager = context.frameBuffer;

        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        // reset
        context.setTransform(1, 0, 0, 1, 0, 0);

        const texture: WebGLTexture = manager
            .getTextureFromCurrentAttachment();

        if (!this._$canApply() || !this._$matrix) {
            return texture;
        }

        context._$applyConvolutionFilter(
            texture,
            this._$matrixX,
            this._$matrixY,
            this._$matrix,
            this._$divisor,
            this._$bias,
            this._$preserveAlpha,
            this._$clamp,
            $intToR(this._$color, this._$alpha, false),
            $intToG(this._$color, this._$alpha, false),
            $intToB(this._$color, this._$alpha, false),
            this._$alpha
        );

        manager.releaseAttachment(currentAttachment, true);

        return manager.getTextureFromCurrentAttachment();
    }
}
