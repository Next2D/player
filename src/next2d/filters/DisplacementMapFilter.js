/**
 * DisplacementMapFilter クラスは、指定された BitmapData オブジェクト（置き換えマップイメージと言います）
 * のピクセル値を使用して、オブジェクトの置き換え（変位）を実行します。
 *
 * The DisplacementMapFilter class uses the pixel values from the specified
 * BitmapData object (called the displacement map image) to perform a displacement of an object.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
class DisplacementMapFilter extends BitmapFilter
{
    /**
     * @param {BitmapData} [map_bitmap = null]
     * @param {Point}      [map_point = null]
     * @param {number}     [component_x = 0]
     * @param {number}     [component_y = 0]
     * @param {number}     [scale_x = 0.0]
     * @param {number}     [scale_y = 0.0]
     * @param {string}     [mode = DisplacementMapFilterMode.WRAP]
     * @param {number}     [color = 0]
     * @param {number}     [alpha = 0.0]
     *
     * @constructor
     * @public
     */
    constructor (
        map_bitmap = null, map_point = null, component_x = 0, component_y = 0,
        scale_x = 0, scale_y = 0, mode = "wrap", color = 0, alpha = 0
    ) {

        super();

        /**
         * @type {BitmapData}
         * @default null
         * @private
         */
        this._$mapBitmap = null;

        /**
         * @type {Point}
         * @default null
         * @private
         */
        this._$mapPoint = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$componentX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$componentY = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scaleX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scaleY = 0;

        /**
         * @type {string}
         * @default DisplacementMapFilterMode.WRAP
         * @private
         */
        this._$mode = DisplacementMapFilterMode.WRAP;

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
        this.mapBitmap  = map_bitmap;
        this.mapPoint   = map_point;
        this.componentX = component_x;
        this.componentY = component_y;
        this.scaleX     = scale_x;
        this.scaleY     = scale_y;
        this.mode       = mode;
        this.color      = color;
        this.alpha      = alpha;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class DisplacementMapFilter]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class DisplacementMapFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.DisplacementMapFilter
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters.DisplacementMapFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object DisplacementMapFilter]
     * @method
     * @public
     */
    toString ()
    {
        return "[object DisplacementMapFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.DisplacementMapFilter
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.filters.DisplacementMapFilter";
    }

    /**
     * @description アルファ透明度の値です。
     *              The alpha transparency value for the color.
     *
     * @member  {number}
     * @default 0
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
            this._$doChanged();
        }
        this._$alpha = alpha;
    }

    /**
     * @description 範囲外置き換えの場合に使用する色を指定します。
     *              Specifies what color to use for out-of-bounds displacements.
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
        color = Util.$clamp(
            Util.$toColorInt(color),0 ,0xffffff, 0
        );

        if (color !== this._$color) {
            this._$doChanged();
        }

        this._$color = color;
    }

    /**
     * @description x の結果を変位させる場合にどのカラーチャンネルをマップイメージで使用するかを指定します。
     *              Describes which color channel to use in the map image to displace the x result.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get componentX ()
    {
        return this._$componentX;
    }
    set componentX (component_x)
    {
        component_x |= 0;
        if (component_x !== this._$componentX) {
            this._$doChanged();
        }

        this._$componentX = 0;
        switch (component_x) {

            case BitmapDataChannel.ALPHA:
            case BitmapDataChannel.BLUE:
            case BitmapDataChannel.GREEN:
            case BitmapDataChannel.RED:
                this._$componentX = component_x;
                break;

            default:
                break;

        }
    }

    /**
     * @description y の結果を変位させる場合にどのカラーチャンネルをマップイメージで使用するかを指定します。
     *              Describes which color channel to use in the map image to displace the y result.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get componentY ()
    {
        return this._$componentY;
    }
    set componentY (component_y)
    {
        component_y |= 0;
        if (component_y !== this._$componentY) {
            this._$doChanged();
        }

        this._$componentY = 0;
        switch (component_y) {

            case BitmapDataChannel.ALPHA:
            case BitmapDataChannel.BLUE:
            case BitmapDataChannel.GREEN:
            case BitmapDataChannel.RED:
                this._$componentY = component_y;
                break;

            default:
                break;

        }
    }

    /**
     * @description 置き換えマップデータが含まれる BitmapData オブジェクトです。
     *              A BitmapData object containing the displacement map data.
     *
     * @member  {BitmapData}
     * @default null
     * @public
     */
    get mapBitmap ()
    {
        return this._$mapBitmap;
    }
    set mapBitmap (map_bitmap)
    {
        if (map_bitmap !== this._$mapBitmap) {
            this._$doChanged();
        }

        // default
        this._$mapBitmap = null;
        if (map_bitmap instanceof BitmapData) {
            this._$mapBitmap = map_bitmap;
        }
    }

    /**
     * @description マップイメージの左上隅を基準としたターゲット表示オブジェクトの
     *              左上隅のオフセットが含まれる値です。
     *              A value that contains the offset of the upper-left corner
     *              of the target display object from the upper-left corner of the map image.
     *
     * @member  {Point}
     * @default null
     * @public
     */
    get mapPoint ()
    {
        return this._$mapPoint;
    }
    set mapPoint (map_point)
    {
        if (map_point !== this._$mapPoint) {
            this._$doChanged();
        }

        // default
        this._$mapPoint = null;

        if (map_point instanceof Point) {
            this._$mapPoint = map_point;
        }
    }

    /**
     * @description フィルターのモードです。
     *              The mode for the filter.
     *
     * @member  {string}
     * @default DisplacementMapFilterMode.WRAP
     * @public
     */
    get mode ()
    {
        return this._$mode;
    }
    set mode (mode)
    {
        mode += "";
        if (mode !== this._$mode) {
            this._$doChanged();
        }

        this._$mode = DisplacementMapFilterMode.WRAP;
        switch (mode) {

            case DisplacementMapFilterMode.CLAMP:
            case DisplacementMapFilterMode.COLOR:
            case DisplacementMapFilterMode.IGNORE:
                this._$mode = mode;
                break;

            default:
                break;

        }
    }

    /**
     * @description マップ計算の x 置き換え結果を拡大 / 縮小する場合に使用する乗数です。
     *              The multiplier to use to scale the x displacement result from the map calculation.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get scaleX ()
    {
        return this._$scaleX;
    }
    set scaleX (scale_x)
    {
        scale_x = Util.$clamp(+scale_x, -0xffff, 0xffff, 0);
        if (scale_x !== this._$scaleX) {
            this._$doChanged();
        }
        this._$scaleX = scale_x;
    }

    /**
     * @description マップ計算の y 置き換え結果を拡大 / 縮小する場合に使用する乗数です。
     *              The multiplier to use to scale the y displacement result from the map calculation.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get scaleY ()
    {
        return this._$scaleY;
    }
    set scaleY (scale_y)
    {
        scale_y = Util.$clamp(+scale_y, -0xffff, 0xffff, 0);
        if (scale_y !== this._$scaleY) {
            this._$doChanged();
        }
        this._$scaleY = scale_y;
    }

    /**
     * @description オブジェクトのコピーを返します。
     *              Returns a copy of this filter object.
     *
     * @return {DisplacementMapFilter}
     * @method
     * @public
     */
    clone ()
    {
        return new DisplacementMapFilter(
            this._$mapBitmap, this._$mapPoint, this._$componentX, this._$componentY,
            this._$scaleX, this._$scaleY, this._$mode, this._$color, this._$alpha
        );
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    _$toArray ()
    {
        return Util.$getArray(4,
            this._$mapBitmap, this._$mapPoint, this._$componentX, this._$componentY,
            this._$scaleX, this._$scaleY, this._$mode, this._$color, this._$alpha
        );
    }

    /**
     * @param  {Rectangle} rect
     * @return {Rectangle}
     * @method
     * @private
     */
    _$generateFilterRect (rect)
    {
        return rect;
    }

    /**
     * @param  {DisplacementMapFilter} filter
     * @return {boolean}
     * @method
     * @private
     */
    _$isSame (filter)
    {
        if (this._$mapBitmap !== filter._$mapBitmap) {
            return false;
        }

        if (this._$mapPoint.x !== filter._$mapPoint.x) {
            return false;
        }

        if (this._$mapPoint.y !== filter._$mapPoint.y) {
            return false;
        }

        if (this._$componentX !== filter._$componentX) {
            return false;
        }

        if (this._$componentY !== filter._$componentY) {
            return false;
        }

        if (this._$scaleX !== filter._$scaleX) {
            return false;
        }

        if (this._$scaleY !== filter._$scaleY) {
            return false;
        }

        if (this._$mode !== filter._$mode) {
            return false;
        }

        if (this._$color !== filter._$color) {
            return false;
        }

        if (this._$alpha !== filter._$alpha) {
            return false;
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
        return this._$mapBitmap
            && this._$componentX && this._$componentY
            && this._$scaleX && this._$scaleY;
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
        this._$updated = false;

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

        // matrix to scale
        const xScale = $Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale = $Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        context._$applyDisplacementMapFilter(
            texture,
            this._$mapBitmap._$texture,
            texture.width  / xScale,
            texture.height / yScale,
            this._$mapPoint,
            this._$componentX,
            this._$componentY,
            this._$scaleX,
            this._$scaleY,
            this._$mode,
            Util.$intToR(this._$color, this._$alpha, true),
            Util.$intToG(this._$color, this._$alpha, true),
            Util.$intToB(this._$color, this._$alpha, true),
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
