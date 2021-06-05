/**
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
class GlowFilter extends BitmapFilter
{
    /**
     * GlowFilter クラスを使用すると、表示オブジェクトにグロー効果を適用できます。
     * グローのスタイルには複数のオプションがあり、内側グロー、外側グロー、ノックアウトモードなどがあります。
     * グローフィルターは、distance プロパティと angle プロパティを 0 に設定したドロップシャドウフィルターによく似ています。
     *
     * The GlowFilter class lets you apply a glow effect to display objects.
     * You have several options for the style of the glow, including inner or outer glow and knockout mode.
     * The glow filter is similar to the drop shadow filter with the distance
     * and angle properties of the drop shadow filter set to 0.
     *
     * @param   {number}  [color=0xFF0000]
     * @param   {number}  [alpha=1]
     * @param   {number}  [blur_x=6]
     * @param   {number}  [blur_y=6]
     * @param   {number}  [strength=2]
     * @param   {int}     [quality=1]
     * @param   {boolean} [inner=false]
     * @param   {boolean} [knockout=false]
     *
     * @constructor
     * @public
     */
    constructor (
        color = 0, alpha = 1, blur_x = 4, blur_y = 4,
        strength = 1, quality = 1, inner = false, knockout = false
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
         * @default 0
         * @private
         */
        this._$color = color;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$alpha = alpha;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$strength = strength;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$inner = inner;

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
     * @default [class GlowFilter]
     * @method
     * @static
     */
    static toString()
    {
        return "[class GlowFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.GlowFilter
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters.GlowFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object GlowFilter]
     * @method
     * @public
     */
    toString ()
    {
        return "[object GlowFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.GlowFilter
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.filters.GlowFilter";
    }

    /**
     * @description アルファ透明度の値です。
     *              The alpha transparency value for the color.
     *
     * @member  {number}
     * @default 1
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
     * @description グローのカラー
     *              The color of the glow.
     *
     * @member  {number}
     * @default 4
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

        this._$color = Util.$toColorInt(color);
    }

    /**
     * @description グローが内側グローであるかどうか
     *              Specifies whether the glow is an inner glow.
     *
     * @member  {boolean}
     * @default true
     * @public
     */
    get inner ()
    {
        return this._$inner;
    }
    set inner (inner)
    {
        if (inner !== this._$inner) {
            this._$doChanged(true);
        }
        this._$inner = inner;
    }

    /**
     * @description オブジェクトにノックアウト効果を適用するかどうか
     *              Specifies whether the object has a knockout effect.
     *
     * @member  {boolean}
     * @default true
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
     * @description オブジェクトのコピーを返します。
     *              Returns a copy of this filter object.
     *
     * @return {GlowFilter}
     * @method
     * @public
     */
    clone ()
    {
        return new GlowFilter(
            this._$color, this._$alpha, this._$blurFilter._$blurX, this._$blurFilter._$blurY,
            this._$strength, this._$blurFilter._$quality, this._$inner, this._$knockout
        );
    }

    /**
     * @return {boolean}
     * @method
     * @public
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
        const clone = rect.clone();
        if (!this._$canApply()) {
            return clone;
        }

        return this
            ._$blurFilter
            ._$generateFilterRect(clone, x_scale, y_scale);
    }

    /**
     * @param  {GlowFilter} filter
     * @return {boolean}
     * @method
     * @private
     */
    _$isSame (filter)
    {
        if (this._$color !== filter._$color) {
            return false;
        }

        if (this._$alpha !== filter._$alpha) {
            return false;
        }

        if (this._$strength !== filter._$strength) {
            return false;
        }

        if (this._$inner !== filter._$inner) {
            return false;
        }

        if (this._$knockout !== filter._$knockout) {
            return false;
        }

        return this._$blurFilter._$isSame(filter._$blurFilter);
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply ()
    {
        if (!this._$alpha || !this._$strength) {
            return false;
        }
        return this._$blurFilter._$canApply();
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

        const width  = (this._$inner) ? baseWidth  : blurWidth;
        const height = (this._$inner) ? baseHeight : blurHeight;

        let baseTextureX, baseTextureY, blurTextureX, blurTextureY;
        if (this._$inner) {
            baseTextureX = 0;
            baseTextureY = 0;
            blurTextureX = -blurOffsetX;
            blurTextureY = -blurOffsetY;
        } else {
            baseTextureX = blurOffsetX - baseOffsetX;
            baseTextureY = blurOffsetY - baseOffsetY;
            blurTextureX = 0;
            blurTextureY = 0;
        }

        const type = (this._$inner)
            ? BitmapFilterType.INNER
            : BitmapFilterType.OUTER;

        context._$bind(currentAttachment);
        context._$applyBitmapFilter(
            blurTexture, width, height,
            baseWidth, baseHeight, baseTextureX, baseTextureY,
            blurWidth, blurHeight, blurTextureX, blurTextureY,
            true, type, this._$knockout,
            this._$strength, this.blurX, this.blurY,
            null, null, null,
            Util.$intToR(this._$color, this._$alpha, true),
            Util.$intToG(this._$color, this._$alpha, true),
            Util.$intToB(this._$color, this._$alpha, true),
            this._$alpha,
            0, 0, 0, 0
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