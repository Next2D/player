/**
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
class ConvolutionFilter extends BitmapFilter
{
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
        matrix_x = 0, matrix_y = 0, matrix = null, divisor = 1,
        bias = 0, preserve_alpha = true, clamp = true, color = 0, alpha = 0
    ) {

        super();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$matrixX = matrix_x;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$matrixY = matrix_y;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$matrix = matrix;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$divisor = divisor;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bias = bias;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$preserveAlpha = preserve_alpha;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$clamp = clamp;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$color = color;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$alpha = alpha;
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
    static toString ()
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
    static get namespace ()
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
    toString ()
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
     * @static
     */
    get namespace ()
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
    get alpha ()
    {
        return this._$alpha;
    }
    set alpha (alpha)
    {
        alpha = Util.$clamp(+alpha, 0, 1, 0);
        if (alpha !== this._$alpha) {
            this._$doChanged(true);
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
    get bias ()
    {
        return this._$bias;
    }
    set bias (bias)
    {
        bias = +bias;
        if (bias !== this._$bias) {
            this._$doChanged(true);
        }
        this._$bias = bias;
    }

    /**
     * @description イメージをクランプする必要があるかどうかを示します。
     *              Indicates whether the image should be clamped.
     *
     * @member  {number}
     * @default true
     * @public
     */
    get clamp ()
    {
        return this._$clamp;
    }
    set clamp (clamp)
    {
        if (clamp !== this._$clamp) {
            this._$doChanged(true);
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
    get color ()
    {
        return this._$color;
    }
    set color (color)
    {
        color |= 0;

        if (color > 0xffffff) {
            color = color % 0x1000000;
        }

        color = Util.$toColorInt(color);
        if (color !== this._$color) {
            this._$doChanged(true);
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
    get divisor ()
    {
        return this._$divisor;
    }
    set divisor (divisor)
    {
        divisor = +divisor;
        if (divisor !== this._$divisor) {
            this._$doChanged(true);
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
    get matrix ()
    {
        return this._$matrix;
    }
    set matrix (matrix)
    {
        this._$doChanged(true);

        if (this._$matrix) {
            Util.$poolArray(this._$matrix);
        }

        // default
        this._$matrix = Util.$getArray();

        if (Util.$isArray(matrix)) {
            this._$matrix = matrix.slice(0);
        }
    }

    /**
     * @description マトリックスの x 次元 (マトリックスの列数) です。
     *              The x dimension of the matrix (the number of columns in the matrix).
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get matrixX ()
    {
        return this._$matrixX;
    }
    set matrixX (matrix_x)
    {
        matrix_x = Util.$clamp(matrix_x|0, 0, 15, 0)|0;
        if (matrix_x !== this._$matrixX) {
            this._$doChanged(true);
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
    get matrixY ()
    {
        return this._$matrixY;
    }
    set matrixY (matrix_y)
    {
        matrix_y = Util.$clamp(matrix_y|0, 0, 15, 0)|0;
        if (matrix_y !== this._$matrixY) {
            this._$doChanged(true);
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
    get preserveAlpha ()
    {
        return this._$preserveAlpha;
    }
    set preserveAlpha (preserve_alpha)
    {
        if (preserve_alpha !== this._$preserveAlpha) {
            this._$doChanged(true);
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
    clone ()
    {
        return new ConvolutionFilter(
            this._$matrixX, this._$matrixY, this._$matrix,
            this._$divisor, this._$bias, this._$preserveAlpha,
            this._$clamp, this._$color, this._$alpha
        );
    }

    /**
     * @param  {Rectangle} rect
     * @param  {number}    [x_scale=null]
     * @param  {number}    [y_scale=null]
     * @return {Rectangle}
     * @method
     * @private
     */
    _$generateFilterRect (rect, x_scale = null, y_scale = null)
    {
        return rect;
    }

    /**
     * @param  {ConvolutionFilter} filter
     * @return {boolean}
     * @method
     * @private
     */
    _$isSame (filter)
    {
        if (this._$matrixX !== filter._$matrixX) {
            return false;
        }

        if (this._$matrixY !== filter._$matrixY) {
            return false;
        }

        if (this._$divisor !== filter._$divisor) {
            return false;
        }

        if (this._$bias !== filter._$bias) {
            return false;
        }

        if (this._$preserveAlpha !== filter._$preserveAlpha) {
            return false;
        }

        if (this._$clamp !== filter._$clamp) {
            return false;
        }

        if (this._$color !== filter._$color) {
            return false;
        }

        if (this._$alpha !== filter._$alpha) {
            return false;
        }

        const length = this._$matrix.length;
        for (let idx = 0; idx < length; ++idx) {
            if (this._$matrix[idx] !== filter._$matrix[idx]) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply ()
    {
        if (this._$matrixX * this._$matrixY !== this._$matrix.length) {
            return false;
        }
        return true;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$applyFilter (context, matrix)
    {
        this._$doChanged(false);

        const currentAttachment = context
            .frameBuffer
            .currentAttachment;

        // reset
        context.setTransform(1, 0, 0, 1, 0, 0);

        const texture = context
            .frameBuffer
            .getTextureFromCurrentAttachment();
        if (!this._$canApply()) {
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
            Util.$intToR(this._$color, this._$alpha, false),
            Util.$intToG(this._$color, this._$alpha, false),
            Util.$intToB(this._$color, this._$alpha, false),
            this._$alpha
        );

        context
            .frameBuffer
            .releaseAttachment(currentAttachment, true);

        return context
            .frameBuffer
            .getTextureFromCurrentAttachment();
    }
}