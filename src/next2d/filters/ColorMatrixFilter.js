/**
 * ColorMatrixFilter クラスを使用すると、表示オブジェクトにぼかし効果を適用できます。
 * ぼかし効果は、イメージの細部をぼかします。ソフトフォーカスがかかっているように見えるぼかしから、
 * 半透明ガラスを通してイメージを見るようにかすんで見えるガウスぼかしまで作成できます。
 * このフィルターの quality プロパティを低く設定すると、ソフトフォーカスがかかっているように見えるぼかしになります。
 * quality プロパティを高く設定すると、ガウスぼかしフィルターに似たものになります。
 *
 * The ColorMatrixFilter class lets you apply a blur visual effect to display objects.
 * A blur effect softens the details of an image.
 * You can produce blurs that range from a softly unfocused look to a Gaussian blur,
 * a hazy appearance like viewing an image through semi-opaque glass.
 * When the quality property of this filter is set to low, the result is a softly unfocused look.
 * When the quality property is set to high, it approximates a Gaussian blur filter.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
class ColorMatrixFilter extends BitmapFilter
{
    /**
     * @param {array} [matrix=null]
     *
     * @constructor
     * @public
     */
    constructor (matrix = null)
    {
        super();

        /**
         * @type {array}
         * @default {array}
         * @private
         */
        this._$matrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$doApply = false;

        // setup
        this.matrix = matrix;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class ColorMatrixFilter]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class ColorMatrixFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.ColorMatrixFilter
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters.ColorMatrixFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object ColorMatrixFilter]
     * @method
     * @public
     */
    toString ()
    {
        return "[object ColorMatrixFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.ColorMatrixFilter
     * @const
     * @public
     */
    get namespace ()
    {
        return "next2d.filters.ColorMatrixFilter";
    }

    /**
     * @description 4×5 カラー変換用の20個のアイテムの配列
     *              An array of 20 items for 4x5 color transform.
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
        if (!$Array.isArray(matrix) || matrix.length !== 20) {
            return ;
        }

        if (this._$matrix) {

            const length = matrix.length;
            for (let idx = 0; idx < length; ++idx) {

                if (matrix[idx] === this._$matrix[idx]) {
                    continue;
                }

                this._$doChanged();
                this._$doApply = true;
                break;
            }

        }

        this._$matrix = matrix;
    }

    /**
     * @description オブジェクトのコピーを返します。
     *              Returns a copy of this filter object.
     *
     * @return {ColorMatrixFilter}
     * @method
     * @public
     */
    clone ()
    {
        return new ColorMatrixFilter(this._$matrix);
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    _$toArray ()
    {
        return Util.$getArray(2,
            this._$matrix
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
     * @param  {ColorMatrixFilter} filter
     * @return {boolean}
     * @method
     * @private
     */
    _$isSame (filter)
    {
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
        return this._$doApply;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$applyFilter (context)
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

        const width   = texture.width;
        const height  = texture.height;

        // new buffer
        const targetTextureAttachment = context
            .frameBuffer
            .createTextureAttachment(width, height);
        context._$bind(targetTextureAttachment);

        // apply
        Util.$resetContext(context);
        context._$applyColorMatrixFilter(texture, this._$matrix);

        // reset
        context
            .frameBuffer
            .releaseAttachment(currentAttachment, true);

        return context
            .frameBuffer
            .getTextureFromCurrentAttachment();

    }
}
