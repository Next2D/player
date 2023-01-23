/**
 * DropShadowFilter クラスは、ドロップシャドウを表示オブジェクトに追加します。
 * シャドウアルゴリズムは、ぼかしフィルターで使用するのと同じボックスフィルターに基づいています。
 * ドロップシャドウのスタイルには複数のオプションがあり、内側シャドウ、外側シャドウ、ノックアウトモードなどがあります。
 *
 * The DropShadowFilter class lets you add a drop shadow to display objects.
 * The shadow algorithm is based on the same box filter that the blur filter uses.
 * You have several options for the style of the drop shadow, including inner
 * or outer shadow and knockout mode.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
class DropShadowFilter extends BitmapFilter
{
    /**
     * @param   {number}  [distance=4]
     * @param   {number}  [angle=45]
     * @param   {number}  [color=0]
     * @param   {number}  [alpha=1]
     * @param   {number}  [blur_x=4]
     * @param   {number}  [blur_y=4]
     * @param   {number}  [strength=1]
     * @param   {number}  [quality=1]
     * @param   {boolean} [inner=false]
     * @param   {boolean} [knockout=false]
     * @param   {boolean} [hide_object=false]
     *
     * @constructor
     * @public
     */
    constructor (
        distance = 4, angle = 45, color = 0, alpha = 1, blur_x = 4, blur_y = 4,
        strength = 1, quality = 1, inner = false, knockout = false, hide_object = false
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
        this._$distance = 4;

        /**
         * @type {number}
         * @default 45
         * @private
         */
        this._$angle = 45;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$color = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$alpha = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$strength = 1;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$inner = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$knockout = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$hideObject = false;

        // setup
        this.distance   = distance;
        this.angle      = angle;
        this.color      = color;
        this.alpha      = alpha;
        this.strength   = strength;
        this.inner      = inner;
        this.knockout   = knockout;
        this.hideObject = hide_object;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class DropShadowFilter]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class DropShadowFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.DropShadowFilter
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters.DropShadowFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object DropShadowFilter]
     * @method
     * @public
     */
    toString ()
    {
        return "[object DropShadowFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.DropShadowFilter
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.filters.DropShadowFilter";
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
        this._$angle = Util.$clamp(angle, -360, 360, 45);
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
        color = Util.$clamp(
            Util.$toColorInt(color), 0, 0xffffff, 0
        );

        if (color !== this._$color) {
            this._$doChanged(true);
        }

        this._$color = color;
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
        distance = Util.$clamp(+distance, -255, 255, 4);
        if (distance !== this._$distance) {
            this._$doChanged(true);
        }
        this._$distance = distance;
    }

    /**
     * @description オブジェクトが非表示であるかどうかを示します。
     *              Indicates whether or not the object is hidden.
     *
     * @member  {boolean}
     * @default true
     * @public
     */
    get hideObject ()
    {
        return this._$hideObject;
    }
    set hideObject (hide_object)
    {
        hide_object = !!hide_object;
        if (hide_object !== this._$hideObject) {
            this._$doChanged(true);
        }
        this._$hideObject = hide_object;
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
        inner = !!inner;
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
        knockout = !!knockout;
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
        strength = Util.$clamp(strength | 0, 0, 255, 0);
        if (strength !== this._$strength) {
            this._$doChanged(true);
        }
        this._$strength = strength;
    }

    /**
     * @description オブジェクトのコピーを返します。
     *              Returns a copy of this filter object.
     *
     * @return {DropShadowFilter}
     * @method
     * @public
     */
    clone ()
    {
        return new DropShadowFilter(
            this._$distance, this._$angle, this._$color, this._$alpha,
            this._$blurFilter._$blurX, this._$blurFilter._$blurY, this._$strength,
            this._$blurFilter._$quality, this._$inner, this._$knockout, this._$hideObject
        );
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    _$toArray ()
    {
        return Util.$getArray(5,
            this._$distance, this._$angle, this._$color, this._$alpha,
            this._$blurFilter._$blurX, this._$blurFilter._$blurY, this._$strength,
            this._$blurFilter._$quality, this._$inner, this._$knockout, this._$hideObject
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
        let clone = rect.clone();
        if (!this._$canApply()) {
            return clone;
        }

        clone = this
            ._$blurFilter
            ._$generateFilterRect(clone, x_scale, y_scale);

        const radian = this._$angle * Util.$Deg2Rad;
        const x      = $Math.cos(radian) * this._$distance * 2;
        const y      = $Math.sin(radian) * this._$distance * 2;

        clone.x      = $Math.min(clone.x, x);
        clone.width  += $Math.abs(x);
        clone.y      = $Math.min(clone.y, y);
        clone.height += $Math.abs(y);

        return clone;
    }

    /**
     * @param  {DropShadowFilter} filter
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

        if (this._$hideObject !== filter._$hideObject) {
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
        return this._$alpha && this._$strength && this._$blurFilter._$canApply();
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
        const manager = context._$frameBufferManager;

        const currentAttachment = manager.currentAttachment;

        // reset
        context.setTransform(1, 0, 0, 1, 0, 0);

        if (!this._$canApply()) {
            return manager.getTextureFromCurrentAttachment();
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

        const xScale = $Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale = $Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        // shadow point
        const radian = this._$angle * Util.$Deg2Rad;
        const x = $Math.cos(radian) * this._$distance * 2 * xScale / Util.$devicePixelRatio;
        const y = $Math.sin(radian) * this._$distance * 2 * yScale / Util.$devicePixelRatio;

        // dropShadow canvas
        const w = this._$inner ? baseWidth  : blurWidth  + $Math.max(0, $Math.abs(x) - offsetDiffX);
        const h = this._$inner ? baseHeight : blurHeight + $Math.max(0, $Math.abs(y) - offsetDiffY);
        const width  = $Math.ceil(w);
        const height = $Math.ceil(h);
        const fractionX = (width  - w) / 2;
        const fractionY = (height - h) / 2;

        let baseTextureX, baseTextureY, blurTextureX, blurTextureY;
        if (this._$inner) {
            baseTextureX = 0;
            baseTextureY = 0;
            blurTextureX = x - blurOffsetX;
            blurTextureY = y - blurOffsetY;
        } else {
            baseTextureX = $Math.max(0, offsetDiffX - x) + fractionX;
            baseTextureY = $Math.max(0, offsetDiffY - y) + fractionY;
            blurTextureX = (x > 0 ? $Math.max(0, x - offsetDiffX) : 0) + fractionX;
            blurTextureY = (y > 0 ? $Math.max(0, y - offsetDiffY) : 0) + fractionY;
        }

        let type, knockout;
        if (this._$inner) {
            type = BitmapFilterType.INNER;
            knockout = this._$knockout || this._$hideObject;
        } else if (!this._$knockout && this._$hideObject) {
            type = BitmapFilterType.FULL;
            knockout = true;
        } else {
            type = BitmapFilterType.OUTER;
            knockout = this._$knockout;
        }

        context._$bind(currentAttachment);
        context._$applyBitmapFilter(
            blurTexture, width, height,
            baseWidth, baseHeight, baseTextureX, baseTextureY,
            blurWidth, blurHeight, blurTextureX, blurTextureY,
            true, type, knockout,
            this._$strength, null, null, null,
            Util.$intToR(this._$color, this._$alpha, true),
            Util.$intToG(this._$color, this._$alpha, true),
            Util.$intToB(this._$color, this._$alpha, true),
            this._$alpha,
            0, 0, 0, 0
        );

        context._$offsetX = baseOffsetX + baseTextureX;
        context._$offsetY = baseOffsetY + baseTextureY;

        manager.releaseTexture(blurTexture);

        return manager.getTextureFromCurrentAttachment();
    }
}
