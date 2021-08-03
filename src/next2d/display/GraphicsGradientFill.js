/**
 * @class
 * @private
 */
class GraphicsGradientFill
{
    /**
     * @param  {string} type
     * @param  {array}  colors
     * @param  {array}  alphas
     * @param  {array}  ratios
     * @param  {Matrix} [matrix=null]
     * @param  {string} [spread_method=SpreadMethod.PAD]
     * @param  {string} [interpolation_method=InterpolationMethod.RGB]
     * @param  {number} [focal_point_ratio=0]
     *
     * @constructor
     * @private
     */
    constructor(
        type, colors, alphas, ratios, matrix = null,
        spread_method = SpreadMethod.PAD,
        interpolation_method = InterpolationMethod.RGB,
        focal_point_ratio = 0
    ) {

        /**
         * @type {string}
         * @private
         */
        this._$type = `${type}`;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$colors = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$alphas = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$ratios = null;

        /**
         * @type {Matrix}
         * @default null
         * @private
         */
        this._$matrix = null;

        /**
         * @type {string}
         * @default SpreadMethod.PAD
         * @private
         */
        this._$spreadMethod = SpreadMethod.PAD;

        /**
         * @type {string}
         * @default InterpolationMethod.RGB
         * @private
         */
        this._$interpolationMethod = InterpolationMethod.RGB;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$focalPointRatio = focal_point_ratio|0;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$colorStops = null;

        // set params
        this.colors              = colors;
        this.alphas              = alphas;
        this.ratios              = ratios;
        this.matrix              = matrix;
        this.spreadMethod        = spread_method;
        this.interpolationMethod = interpolation_method;
    }

    /**
     * @description colors 配列内の各色に対応するアルファ値の配列です。
     *              An array of alpha values for the corresponding colors in the colors array.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get alphas ()
    {
        return this._$alphas;
    }
    set alphas (alphas)
    {
        this._$alphas = null;
        if (Util.$isArray(alphas)) {

            this._$alphas = Util.$getArray();

            const length = alphas.length;
            for (let idx = 0; idx < length; ++idx) {
                this._$alphas[idx] = Util.$clamp(alphas[idx], 0, 1, 0);
            }
        }
    }

    /**
     * @description グラデーションで使用する RGB 16 進数カラー値の配列です。
     *              An array of RGB hexadecimal color values to use in the gradient.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get colors ()
    {
        return this._$colors;
    }
    set colors (colors)
    {
        this._$colors = null;
        if (Util.$isArray(colors)) {

            this._$colors = Util.$getArray();

            const length = colors.length;
            for (let idx = 0; idx < length; ++idx) {
                this._$colors[idx] = Util.$clamp(
                    Util.$toColorInt(colors[idx]), 0, 0xffffff, 0xffffff
                );
            }
        }
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
        if (!this._$colorStops) {

            this._$colorStops = Util.$getArray();

            const length = Util.$min(
                Util.$min(this._$alphas.length, this._$colors.length),
                this._$ratios.length
            );

            for (let idx = 0; idx < length; ++idx) {

                const object = Util.$intToRGBA(
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
     * @description グラデーションの焦点の位置を制御する数値です。
     *              A number that controls the location
     *              of the focal point of the gradient.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get focalPointRatio ()
    {
        return this._$focalPointRatio;
    }
    set focalPointRatio (focal_point_ratio)
    {
        this._$focalPointRatio = focal_point_ratio;
    }

    /**
     * @description 使用する値を指定する InterpolationMethod クラスの値です。
     *              A value from the InterpolationMethod class that specifies which value to use.
     *
     * @member  {string}
     * @default InterpolationMethod.RGB
     * @public
     */
    get interpolationMethod ()
    {
        return this._$interpolationMethod;
    }
    set interpolationMethod (interpolation_method)
    {
        this._$interpolationMethod = (InterpolationMethod.LINEAR_RGB === interpolation_method)
            ? interpolation_method
            : InterpolationMethod.RGB;
    }

    /**
     * @description Matrix クラスで定義される変換マトリックスです。
     *              A transformation matrix as defined by the Matrix class.
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
        this._$matrix = (matrix instanceof Matrix) ? matrix : null;
    }

    /**
     * @description 色分布の比率の配列です。
     *              An array of color distribution ratios.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get ratios ()
    {
        return this._$ratios;
    }
    set ratios (ratios)
    {
        this._$ratios = null;

        if (Util.$isArray(ratios)) {

            this._$ratios = Util.$getArray();

            const length = ratios.length;
            for (let idx = 0; idx < length; ++idx) {
                this._$ratios[idx] = Util.$clamp(ratios[idx], 0, 255, 0);
            }
        }
    }

    /**
     * @description 使用する spread メソッドを指定する SpreadMethod クラスの値です。
     *              A value from the SpreadMethod class that specifies which spread method to use.
     *
     * @member  {string}
     * @default SpreadMethod.PAD
     * @public
     */
    get spreadMethod ()
    {
        return this._$spreadMethod;
    }
    set spreadMethod (spread_method)
    {
        switch (spread_method) {

            case SpreadMethod.REFLECT:
            case SpreadMethod.REPEAT:
                this._$spreadMethod = spread_method;
                break;

            default:
                this._$spreadMethod = SpreadMethod.PAD;
                break;
        }
    }

    /**
     * @description 使用するグラデーションのタイプを指定する GradientType クラスの値です。
     *              A value from the GradientType class that specifies which gradient type to use.
     *
     * @member  {string}
     * @default GradientType.LINEAR
     * @public
     */
    get type ()
    {
        return this._$type;
    }
    set type (type)
    {
        this._$type = (GradientType.RADIAL === type)
            ? type
            : GradientType.LINEAR;
    }

    /**
     * @description このクラスのもつパラメーターを全てコピーする
     *              Copy all the parameters of this class
     *
     * @return {GraphicsGradientFill}
     * @method
     * @public
     */
    clone ()
    {
        return new GraphicsGradientFill(
            this._$type,
            this.colors.slice(0),
            this.alphas.slice(0),
            this.ratios.slice(0),
            (this._$matrix) ? this._$matrix.clone() : null,
            this._$spreadMethod,
            this._$interpolationMethod,
            this._$focalPointRatio
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
        const matrix = (this._$matrix)
            ? this._$matrix._$matrix
            : Util.$MATRIX_ARRAY_RATIO_0_0_RATIO_0_0;

        return Util.$getArray(
            this._$type,
            this.colorStops,
            matrix,
            this._$spreadMethod,
            this._$interpolationMethod,
            this._$focalPointRatio
        );
    }
}