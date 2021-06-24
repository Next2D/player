/**
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
class GradientGlowFilter  extends BitmapFilter
{
    /**
     * GradientGlowFilter クラスを使用すると、表示オブジェクトにグラデーショングロー効果を適用できます。
     * グラデーショングローとは、制御可能なカラーグラデーションによるリアルな輝きです。
     * グラデーショングローは、オブジェクトの内側エッジや外側エッジの周囲、またはオブジェクトの上に適用できます。
     *
     * The GradientGlowFilter class lets you apply a gradient glow effect to display objects.
     * A gradient glow is a realistic-looking glow with a color gradient that you can control.
     * You can apply a gradient glow around the inner or outer edge of an object or on top of an object.
     *
     * @param {number}  [distance=4.0]
     * @param {number}  [angle=45]
     * @param {array}   [colors=null]
     * @param {array}   [alphas=null]
     * @param {array}   [ratios=null]
     * @param {number}  [blur_x=4.0]
     * @param {number}  [blur_y=4.0]
     * @param {number}  [strength=1]
     * @param {number}  [quality=1]
     * @param {string}  [type=BitmapFilterType.INNER]
     * @param {boolean} [knockout=false]
     *
     * @constructor
     * @public
     */
    constructor (
        distance = 4, angle = 45, colors = null, alphas = null,
        ratios = null, blur_x = 4, blur_y = 4, strength = 1,
        quality = 1, type = "inner", knockout = false
    ) {

        super();

        /**
         * @type {BlurFilter}
         * @default BlurFilter
         * @private
         */
        this._$blurFilter = new BlurFilter(blur_x, blur_y, quality);

        /**
         * @type {number}
         * @default 4
         * @private
         */
        this._$distance = distance;

        /**
         * @type {number}
         * @default 45
         * @private
         */
        this._$angle = angle;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$colors = colors;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$alphas = alphas;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$ratios = ratios;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$strength = strength;

        /**
         * @type {string}
         * @default BitmapFilterType.INNER
         * @private
         */
        this._$type = type;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$knockout = knockout;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class GradientGlowFilter]
     * @method
     * @static
     */
    static toString()
    {
        return "[class GradientGlowFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.GradientGlowFilter
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters.GradientGlowFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object GradientGlowFilter]
     * @method
     * @public
     */
    toString ()
    {
        return "[object GradientGlowFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.GradientGlowFilter
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.filters.GradientGlowFilter";
    }

    /**
     * @description カラー配列内の各色に対応するアルファ透明度の値の配列です。
     *              An array of alpha transparency values
     *              for the corresponding colors in the colors array.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get alphas ()
    {
        return (!this._$colors || !this._$ratios) ? null : this._$alphas;
    }
    set alphas (alphas)
    {
        this._$alphas = null;
        if (Util.$isArray(alphas)) {

            this._$doChanged(true);

            const length = alphas.length;
            for (let idx = 0; idx < length; ++idx) {
                const alpha = +alphas[idx];
                alphas[idx] = Util.$clamp(alpha, 0, 1, 0);
            }

            this._$alphas = alphas.slice(0);
        }
    }

    /**
     * @description シャドウの角度
     *              The angle of the shadow.
     *
     * @member  {number}
     * @default 45
     * @public
     */
    get angle ()
    {
        return this._$angle;
    }
    set angle (angle)
    {
        angle %= 360;
        if (angle !== this._$angle) {
            this._$doChanged(true);
        }
        this._$angle = angle;
    }

    /**
     * @description 水平方向のぼかし量。
     *              The amount of horizontal blur.
     *
     * @member  {number}
     * @default 4
     * @public
     */
    get blurX ()
    {
        return this._$blurFilter._$blurX;
    }
    set blurX (blur_x)
    {
        this._$blurFilter.blurX = blur_x;
    }

    /**
     * @description 垂直方向のぼかし量。
     *              The amount of vertical blur.
     *
     * @member  {number}
     * @default 4
     * @public
     */
    get blurY ()
    {
        return this._$blurFilter._$blurY;
    }
    set blurY (blur_y)
    {
        this._$blurFilter.blurY = blur_y;
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
        return (!this._$alphas || !this._$ratios) ? null : this._$colors;
    }
    set colors (colors)
    {
        this._$colors = null;
        if (Util.$isArray(colors)) {

            this._$doChanged(true);

            const length = colors.length;
            for (let idx = 0; idx < length; ++idx) {

                let color = colors[idx]|0;

                if (color < 0) {
                    color = 0x1000000 - (Util.$abs(color) % 0x1000000);
                }

                if (color > 0xffffff) {
                    color = color % 0x1000000;
                }

                colors[idx] = Util.$toColorInt(Util.$abs(color));
            }

            this._$colors = colors.slice(0);
        }
    }

    /**
     * @description シャドウのオフセット距離です。
     *              The offset distance for the shadow, in pixels.
     *
     * @member  {number}
     * @default 4
     * @public
     */
    get distance ()
    {
        return this._$distance;
    }
    set distance (distance)
    {
        distance = +distance;
        if (distance !== this._$distance) {
            this._$doChanged(true);
        }
        this._$distance = distance;
    }

    /**
     * @description オブジェクトにノックアウト効果を適用するかどうか
     *              Specifies whether the object has a knockout effect.
     *
     * @member  {boolean}
     * @default false
     * @public
     */
    get knockout ()
    {
        return this._$knockout;
    }
    set knockout (knockout)
    {
        if (knockout !== this._$knockout) {
            this._$doChanged(true);
        }
        this._$knockout = knockout;
    }

    /**
     * @description ぼかしの実行回数です。
     *              The number of times to perform the blur.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get quality ()
    {
        return this._$blurFilter._$quality;
    }
    set quality (quality)
    {
        this._$blurFilter.quality = quality;
    }

    /**
     * @description カラー配列内の対応するカラーの色分布比率の配列です。
     *              An array of color distribution ratios
     *              for the corresponding colors in the colors array.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get ratios ()
    {
        return (!this._$alphas || !this._$colors) ? null : this._$ratios;
    }
    set ratios (ratios)
    {
        this._$ratios = null;
        if (Util.$isArray(ratios)) {

            this._$doChanged(true);

            const length = ratios.length;
            for (let idx = 0; idx < length; ++idx) {
                const ratio = Util.$clamp(+ratios[idx], 0, 255, 0);
                ratios[idx] = ratio;
            }

            this._$ratios = ratios.slice(0);
        }
    }

    /**
     * @description インプリントの強さまたは広がりです。
     *              The strength of the imprint or spread.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get strength ()
    {
        return this._$strength;
    }
    set strength (strength)
    {
        strength = Util.$clamp(strength|0, 0, 255, 0);
        if (strength !== this._$strength) {
            this._$doChanged(true);
        }
        this._$strength = strength;
    }

    /**
     * @description オブジェクトでのベベルの配置
     *              The placement of the bevel on the object.
     *
     * @member  {string}
     * @default BitmapFilterType.INNER
     * @public
     */
    get type ()
    {
        return this._$type;
    }
    set type (type)
    {
        type += "";
        if (type !== this._$type) {
            this._$doChanged(true);
        }

        switch (type) {

            case BitmapFilterType.OUTER:
            case BitmapFilterType.INNER:
                this._$type = type;
                break;

            default:
                this._$type = BitmapFilterType.FULL;
                break;

        }
    }

    /**
     * @description オブジェクトのコピーを返します。
     *              Returns a copy of this filter object.
     *
     * @return {GradientGlowFilter}
     * @method
     * @public
     */
    clone ()
    {
        return new GradientGlowFilter(
            this._$distance, this._$angle, this._$colors, this._$alphas, this._$ratios,
            this._$blurFilter._$blurX, this._$blurFilter._$blurY, this._$strength,
            this._$blurFilter._$quality, this._$type, this._$knockout
        );
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$isUpdated ()
    {
        return this._$updated || this._$blurFilter._$isUpdated();
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
        let clone = rect.clone();
        if (!this._$canApply()) {
            return clone;
        }

        clone = this
            ._$blurFilter
            ._$generateFilterRect(clone, x_scale, y_scale);

        const radian = +(this.angle * Util.$PI / 180);
        const x      = +(Util.$cos(radian) * this.distance);
        const y      = +(Util.$sin(radian) * this.distance);

        let dx = 0;
        let dy = 0;
        let dw = 0;
        let dh = 0;

        switch (x < 0) {

            case true:
                dx = Util.$floor(x)|0;
                dw = -Util.$round(x / 2)|0;
                break;

            default:
                dx = Util.$round(x / 2)|0;
                dw = (x / 2)|0;
                break;

        }

        switch (y < 0) {

            case true:
                dy = Util.$floor(y)|0;
                dh = -Util.$round(y / 2)|0;
                break;

            default:
                dy = Util.$round(y / 2)|0;
                dh = (y / 2)|0;
                break;

        }

        clone.x      += dx;
        clone.width  += dw;
        clone.y      += dy;
        clone.height += dh;

        return clone;
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply ()
    {
        if (this._$strength === 0 || !this._$alphas
            || !this._$ratios || !this._$colors
        ) {
            return false;
        }
        return true;
    }

    /**
     * @param  {GradientGlowFilter} filter
     * @return {boolean}
     * @method
     * @private
     */
    _$isSame (filter)
    {
        if (this._$distance !== filter._$distance) {
            return false;
        }

        if (this._$angle !== filter._$angle) {
            return false;
        }

        for (let idx = 0; idx < this._$colors.length; ++idx) {
            if (this._$colors[idx] !== filter._$colors[idx]) {
                return false;
            }
        }

        for (let idx = 0; idx < this._$alphas.length; ++idx) {
            if (this._$alphas[idx] !== filter._$alphas[idx]) {
                return false;
            }
        }

        for (let idx = 0; idx < this._$ratios.length; ++idx) {
            if (this._$ratios[idx] !== filter._$ratios[idx]) {
                return false;
            }
        }

        if (this._$strength !== filter._$strength) {
            return false;
        }

        if (this._$type !== filter._$type) {
            return false;
        }

        if (this._$knockout !== filter._$knockout) {
            return false;
        }

        return this._$blurFilter._$isSame(filter._$blurFilter);
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {array}  matrix
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

        if (!this._$canApply()) {
            return context
                .frameBuffer
                .getTextureFromCurrentAttachment();
        }

        const baseWidth   = currentAttachment.width;
        const baseHeight  = currentAttachment.height;
        const baseOffsetX = context._$offsetX;
        const baseOffsetY = context._$offsetY;

        const blurTexture = this
            ._$blurFilter
            ._$applyFilter(context, matrix, false);

        const blurWidth   = blurTexture.width;
        const blurHeight  = blurTexture.height;
        const blurOffsetX = context._$offsetX;
        const blurOffsetY = context._$offsetY;

        const offsetDiffX = blurOffsetX - baseOffsetX;
        const offsetDiffY = blurOffsetY - baseOffsetY;

        // matrix to scale
        const xScale = Util.$sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale = Util.$sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        // shadow point
        const radian = +(this._$angle * Util.$Deg2Rad);
        const x = +(Util.$cos(radian) * this._$distance * xScale);
        const y = +(Util.$sin(radian) * this._$distance * yScale);

        const isInner = (this.type === BitmapFilterType.INNER);
        const w = (isInner) ? baseWidth  : blurWidth  + Util.$max(0, Util.$abs(x) - offsetDiffX);
        const h = (isInner) ? baseHeight : blurHeight + Util.$max(0, Util.$abs(y) - offsetDiffY);
        const width  = Util.$ceil(w);
        const height = Util.$ceil(h);
        const fractionX = (width  - w) / 2;
        const fractionY = (height - h) / 2;

        let baseTextureX, baseTextureY, blurTextureX, blurTextureY;
        if (isInner) {
            baseTextureX = 0;
            baseTextureY = 0;
            blurTextureX = x - blurOffsetX;
            blurTextureY = y - blurOffsetY;
        } else {
            baseTextureX = Util.$max(0, offsetDiffX - x) + fractionX;
            baseTextureY = Util.$max(0, offsetDiffY - y) + fractionY;
            blurTextureX = ((x > 0) ? Util.$max(0, x - offsetDiffX) : 0) + fractionX;
            blurTextureY = ((y > 0) ? Util.$max(0, y - offsetDiffY) : 0) + fractionY;
        }

        context._$bind(currentAttachment);
        context._$applyBitmapFilter(
            blurTexture, width, height,
            baseWidth, baseHeight, baseTextureX, baseTextureY,
            blurWidth, blurHeight, blurTextureX, blurTextureY,
            true, this.type, this.knockout,
            this._$strength, this.blurX, this.blurY,
            this.ratios, this.colors, this.alphas,
            0, 0, 0, 0, 0, 0, 0, 0
        );

        context._$offsetX = baseOffsetX + baseTextureX;
        context._$offsetY = baseOffsetY + baseTextureY;

        context
            .frameBuffer
            .releaseTexture(blurTexture);

        return context
            .frameBuffer
            .getTextureFromCurrentAttachment();
    }
}