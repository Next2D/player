/**
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
class BevelFilter extends BitmapFilter
{
    /**
     * BevelFilter クラスを使用すると、表示オブジェクトにベベル効果を追加できます。
     * ボタンなどのオブジェクトにベベル効果を適用すると 3 次元的に表現されます。
     * 異なるハイライトカラー、シャドウカラー、ベベルのぼかし量、ベベルの角度、ベベルの配置、
     * ノックアウト効果を使用して、ベベルの外観をカスタマイズできます。
     *
     * The BevelFilter class lets you add a bevel effect to display objects.
     * A bevel effect gives objects such as buttons a three-dimensional look.
     * You can customize the look of the bevel with different highlight and shadow colors,
     * the amount of blur on the bevel, the angle of the bevel, the placement of the bevel,
     * and a knockout effect.
     *
     * @param {number}  [distance=4]
     * @param {number}  [angle=45]
     * @param {uint}    [highlight_color=0xffffff]
     * @param {number}  [highlight_alpha=1]
     * @param {uint}    [shadow_color=0x000000]
     * @param {number}  [shadow_alpha=1]
     * @param {number}  [blur_x=4]
     * @param {number}  [blur_y=4]
     * @param {number}  [strength=1]
     * @param {int}     [quality=1]
     * @param {string}  [type=BitmapFilterType.INNER]
     * @param {boolean} [knockout=false]
     *
     * @constructor
     * @public
     */
    constructor (
        distance = 4, angle = 45, highlight_color = 0xffffff, highlight_alpha = 1,
        shadow_color = 0, shadow_alpha = 1, blur_x = 4, blur_y = 4,
        strength = 1, quality = 1, type = "inner", knockout = false
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
         * @type {number}
         * @default 0xffffff
         * @private
         */
        this._$highlightColor = highlight_color;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$highlightAlpha = highlight_alpha;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$shadowColor = shadow_color;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$shadowAlpha = shadow_alpha;

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
     * @default [class BevelFilter]
     * @method
     * @static
     */
    static toString()
    {
        return "[class BevelFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters:BevelFilter
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters:BevelFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BevelFilter]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BevelFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters:BevelFilter
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.filters:BevelFilter";
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
     * @description アルファ透明度の値です。
     *              The alpha transparency value for the color.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get highlightAlpha ()
    {
        return this._$highlightAlpha;
    }
    set highlightAlpha (highlight_alpha)
    {
        highlight_alpha = Util.$clamp(+highlight_alpha, 0, 1, 0);
        if (highlight_alpha !== this._$highlightAlpha) {
            this._$doChanged(true);
        }
        this._$highlightAlpha = highlight_alpha;
    }

    /**
     * @description グローのカラー
     *              The color of the glow.
     *
     * @member  {number}
     * @default 0xffffff
     * @public
     */
    get highlightColor ()
    {
        return this._$highlightColor;
    }
    set highlightColor (highlight_color)
    {
        highlight_color |= 0;

        if (highlight_color > 0xffffff) {
            highlight_color = highlight_color % 0x1000000;
        }

        highlight_color = Util.$toColorInt(highlight_color);
        if (highlight_color !== this._$highlightColor) {
            this._$doChanged(true);
        }

        this._$highlightColor = highlight_color;
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
     * @description アルファ透明度の値です。
     *              The alpha transparency value for the color.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get shadowAlpha ()
    {
        return this._$shadowAlpha;
    }
    set shadowAlpha (shadow_alpha)
    {
        shadow_alpha = Util.$clamp(+shadow_alpha, 0, 1, 0);
        if (shadow_alpha !== this._$shadowAlpha) {
            this._$doChanged(true);
        }
        this._$shadowAlpha = shadow_alpha;
    }

    /**
     * @description グローのカラー
     *              The color of the glow.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get shadowColor ()
    {
        return this._$shadowColor;
    }
    set shadowColor (shadow_color)
    {
        shadow_color |= 0;

        if (shadow_color > 0xffffff) {
            shadow_color = shadow_color % 0x1000000;
        }

        shadow_color = Util.$toColorInt(shadow_color);
        if (shadow_color !== this._$shadowColor) {
            this._$doChanged(true);
        }

        this._$shadowColor = shadow_color;
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
     * @return {BevelFilter}
     * @method
     * @public
     */
    clone ()
    {
        return new BevelFilter(
            this._$distance, this._$angle, this._$highlightColor, this._$highlightAlpha,
            this._$shadowColor, this._$shadowAlpha, this._$blurFilter._$blurX, this._$blurFilter._$blurY,
            this._$strength, this._$blurFilter._$quality, this._$type, this._$knockout
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

        clone = this._$blurFilter._$generateFilterRect(clone, x_scale, y_scale);

        const radian = +(this.angle * Util.$PI / 180);
        const x      = Util.$cos(radian) * this.distance;
        const y      = Util.$sin(radian) * this.distance;
        let dx       = Util.$abs(x)|0;
        let dy       = Util.$abs(y)|0;

        if (0 > x) {
            dx++;
        }

        if (0 > y) {
            dy++;
        }

        if (dx === 0 && 0 > y) {
            dx = 1;
        }

        if (dy === 0 && 0 > x) {
            dy = 1;
        }

        clone.x      -= dx;
        clone.width  += (dx * 2);
        clone.y      -= dy;
        clone.height += (dy * 2);

        return clone;
    }

    /**
     * @param  {BevelFilter} filter
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

        if (this._$highlightColor !== filter._$highlightColor) {
            return false;
        }

        if (this._$highlightAlpha !== filter._$highlightAlpha) {
            return false;
        }

        if (this._$shadowColor !== filter._$shadowColor) {
            return false;
        }

        if (this._$shadowAlpha !== filter._$shadowAlpha) {
            return false;
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
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply ()
    {
        if (!this._$strength || !this._$distance) {
            return false;
        }
        return true;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {array}  matrix
     * @return {WebGLTexture}
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

        const baseTexture = context
            .frameBuffer
            .getTextureFromCurrentAttachment();
        if (!this._$canApply()) {
            return baseTexture;
        }

        const baseWidth   = currentAttachment.width;
        const baseHeight  = currentAttachment.height;
        const baseOffsetX = context._$offsetX;
        const baseOffsetY = context._$offsetY;

        // matrix to scale
        const xScale = +(Util.$sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]) * Util.$TWIPS);
        const yScale = +(Util.$sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]) * Util.$TWIPS);

        // pointer
        const radian = +(this._$angle * Util.$Deg2Rad);
        const x = +(Util.$cos(radian) * this._$distance * xScale);
        const y = +(Util.$sin(radian) * this._$distance * yScale);

        // highlight buffer
        let highlightTextureBaseAttachment = context
            .frameBuffer
            .createTextureAttachment(baseWidth, baseHeight);
        context._$bind(highlightTextureBaseAttachment);

        Util.$resetContext(context);
        context.drawImage(baseTexture, 0, 0, baseWidth, baseHeight);

        context.globalCompositeOperation = BlendMode.ERASE;
        context.drawImage(baseTexture, x * 2, y * 2, baseWidth, baseHeight);

        const highlightTextureBase = this
            ._$blurFilter
            ._$applyFilter(context, matrix, false);

        const blurWidth   = highlightTextureBase.width;
        const blurHeight  = highlightTextureBase.height;
        const bevelWidth  = Util.$ceil(blurWidth  + Util.$abs(x) * 2);
        const bevelHeight = Util.$ceil(blurHeight + Util.$abs(y) * 2);

        // bevel filter buffer
        const isInner = (this._$type === BitmapFilterType.INNER);
        const width   = (isInner) ? baseWidth  : bevelWidth;
        const height  = (isInner) ? baseHeight : bevelHeight;

        const absX = Util.$abs(x);
        const absY = Util.$abs(y);
        const blurOffsetX = (blurWidth  - baseWidth)  / 2;
        const blurOffsetY = (blurHeight - baseHeight) / 2;

        let baseTextureX, baseTextureY, blurTextureX, blurTextureY;
        if (isInner) {
            baseTextureX = 0;
            baseTextureY = 0;
            blurTextureX = -blurOffsetX - x;
            blurTextureY = -blurOffsetY - y;
        } else {
            baseTextureX = absX + blurOffsetX;
            baseTextureY = absY + blurOffsetY;
            blurTextureX = absX - x;
            blurTextureY = absY - y;
        }

        context._$bind(currentAttachment);
        context._$applyBitmapFilter(
            highlightTextureBase, width, height,
            baseWidth, baseHeight, baseTextureX, baseTextureY,
            blurWidth, blurHeight, blurTextureX, blurTextureY,
            false, this._$type, this._$knockout,
            this._$strength, this.blurX, this.blurY,
            null, null, null,
            Util.$intToR(this._$highlightColor, this._$highlightAlpha, true),
            Util.$intToG(this._$highlightColor, this._$highlightAlpha, true),
            Util.$intToB(this._$highlightColor, this._$highlightAlpha, true),
            this._$highlightAlpha,
            Util.$intToR(this._$shadowColor, this._$shadowAlpha, true),
            Util.$intToG(this._$shadowColor, this._$shadowAlpha, true),
            Util.$intToB(this._$shadowColor, this._$shadowAlpha, true),
            this._$shadowAlpha
        );

        context._$offsetX = baseOffsetX + baseTextureX;
        context._$offsetY = baseOffsetY + baseTextureY;

        context
            .frameBuffer
            .releaseTexture(highlightTextureBase);

        return context
            .frameBuffer
            .getTextureFromCurrentAttachment();
    }
}