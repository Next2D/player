/**
 * BlurFilter クラスを使用すると、表示オブジェクトにぼかし効果を適用できます。
 * ぼかし効果は、イメージの細部をぼかします。ソフトフォーカスがかかっているように見えるぼかしから、
 * 半透明ガラスを通してイメージを見るようにかすんで見えるガウスぼかしまで作成できます。
 * このフィルターの quality プロパティを低く設定すると、ソフトフォーカスがかかっているように見えるぼかしになります。
 * quality プロパティを高く設定すると、ガウスぼかしフィルターに似たものになります。
 *
 * The BlurFilter class lets you apply a blur visual effect to display objects.
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
class BlurFilter extends BitmapFilter
{
    /**
     * @param {number}  [blur_x=4]
     * @param {number}  [blur_y=4]
     * @param {int}     [quality=1]
     *
     * @constructor
     * @public
     */
    constructor (blur_x = 4, blur_y = 4, quality = 1)
    {
        super();

        /**
         * @type {number}
         * @default 4
         * @private
         */
        this._$blurX = 4;

        /**
         * @type {number}
         * @default 4
         * @private
         */
        this._$blurY = 4;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$quality = 1;

        // setup
        this.blurX   = blur_x;
        this.blurY   = blur_y;
        this.quality = quality;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class BlurFilter]
     * @method
     * @static
     */
    static toString ()
    {
        return "[class BlurFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.BlurFilter
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.filters.BlurFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BlurFilter]
     * @method
     * @public
     */
    toString ()
    {
        return "[object BlurFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.BlurFilter
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.filters.BlurFilter";
    }

    /**
     * @return {array}
     * @private
     */
    static get STEP ()
    {
        return [0.5, 1.05, 1.4, 1.55, 1.75, 1.9, 2, 2.15, 2.2, 2.3, 2.5, 3, 3, 3.5, 3.5];
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
        return this._$blurX;
    }
    set blurX (blur_x)
    {
        blur_x = Util.$clamp(+blur_x, 0, 255, 0);
        if (blur_x !== this._$blurX) {
            this._$doChanged(true);
        }
        this._$blurX = blur_x;
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
        return this._$blurY;
    }
    set blurY (blur_y)
    {
        blur_y = Util.$clamp(+blur_y, 0, 255, 0);
        if (blur_y !== this._$blurY) {
            this._$doChanged(true);
        }
        this._$blurY = blur_y;
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
        return this._$quality;
    }
    set quality (quality)
    {
        quality = Util.$clamp(quality | 0, 0, 15, BitmapFilterQuality.LOW);
        if (quality !== this._$quality) {
            this._$doChanged(true);
        }
        this._$quality = quality;
    }

    /**
     * @description オブジェクトのコピーを返します。
     *              Returns a copy of this filter object.
     *
     * @return {BlurFilter}
     * @method
     * @public
     */
    clone ()
    {
        return new BlurFilter(this._$blurX, this._$blurY, this._$quality);
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

        if (!this._$quality) {
            return clone;
        }

        const step = BlurFilter.STEP[this._$quality - 1];

        let dx = 0 >= this._$blurX ? 1 : this._$blurX * step;
        let dy = 0 >= this._$blurY ? 1 : this._$blurY * step;

        switch (true) {

            case typeof x_scale === "number":
            case typeof y_scale === "number":
                dx *= x_scale;
                dy *= y_scale;
                break;

            default:
                dx = Util.$round(dx);
                dy = Util.$round(dy);
                break;

        }

        clone.x      -= dx;
        clone.width  += dx * 2;
        clone.y      -= dy;
        clone.height += dy * 2;

        return clone;
    }

    /**
     * @param  {BlurFilter} filter
     * @return {boolean}
     * @method
     * @private
     */
    _$isSame (filter)
    {
        if (this._$quality !== filter._$quality) {
            return false;
        }

        if (this._$blurX !== filter._$blurX) {
            return false;
        }

        if (this._$blurY !== filter._$blurY) {
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
        if (!this._$quality || !this._$blurX && !this._$blurY) {
            return false;
        }
        return true;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {boolean} [removed=true]
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$applyFilter (context, matrix, removed = true)
    {
        this._$doChanged(false);

        const currentAttachment = context
            .frameBuffer
            .currentAttachment;

        const baseTexture = context
            .frameBuffer
            .getTextureFromCurrentAttachment();

        if (!this._$canApply()) {
            if (removed) {
                return baseTexture;
            }
            return context
                .frameBuffer
                .createTextureFromCurrentAttachment();

        }

        // matrix to scale
        const xScale = Util.$sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale = Util.$sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        // after size
        const baseRect = new Rectangle(0, 0, baseTexture.width, baseTexture.height);
        const rect = this._$generateFilterRect(baseRect, xScale, yScale);

        const width   = Util.$ceil(rect.width) | 0;
        const height  = Util.$ceil(rect.height) | 0;
        const offsetX = Util.$ceil(Util.$abs(rect.x) + Util.$abs(width  - rect.width)  * 0.5);
        const offsetY = Util.$ceil(Util.$abs(rect.y) + Util.$abs(height - rect.height) * 0.5);

        // set offset xy
        context._$offsetX = +(offsetX + context._$offsetX);
        context._$offsetY = +(offsetY + context._$offsetY);

        const baseBlurX = this._$blurX * xScale;
        const baseBlurY = this._$blurY * yScale;

        let bufferScaleX = 1;
        let bufferScaleY = 1;

        if (baseBlurX > 128) {
            bufferScaleX = 0.0625;
        } else if (baseBlurX > 64) {
            bufferScaleX = 0.125;
        } else if (baseBlurX > 32) {
            bufferScaleX = 0.25;
        } else if (baseBlurX > 16) {
            bufferScaleX = 0.5;
        }

        if (baseBlurY > 128) {
            bufferScaleY = 0.0625;
        } else if (baseBlurY > 64) {
            bufferScaleY = 0.125;
        } else if (baseBlurY > 32) {
            bufferScaleY = 0.25;
        } else if (baseBlurY > 16) {
            bufferScaleY = 0.5;
        }

        const bufferBlurX = baseBlurX * bufferScaleX;
        const bufferBlurY = baseBlurY * bufferScaleY;

        let bufferWidth  = Util.$ceil(width  * bufferScaleX);
        let bufferHeight = Util.$ceil(height * bufferScaleY);

        const attachment0 = context
            .frameBuffer
            .createTextureAttachment(bufferWidth, bufferHeight);

        const attachment1 = context
            .frameBuffer
            .createTextureAttachment(bufferWidth, bufferHeight);

        const attachments = [attachment0, attachment1];
        let attachmentIndex = 0;

        context._$bind(attachment0);

        // draw
        Util.$resetContext(context);
        context.setTransform(bufferScaleX, 0, 0, bufferScaleY, 0, 0);
        context.drawImage(
            baseTexture, offsetX, offsetY,
            baseTexture.width, baseTexture.height
        );

        // set alpha
        context.blend.toOneZero();

        // execute
        let targetTexture = context
            .frameBuffer
            .getTextureFromCurrentAttachment();

        for (let q = 0; q < this._$quality; ++q) {

            // draw blur x
            if (this._$blurX > 0) {

                attachmentIndex = (attachmentIndex + 1) % 2;

                const xTexture = attachments[attachmentIndex];
                context._$bind(xTexture);

                context._$applyBlurFilter(targetTexture, true, bufferBlurX);

                targetTexture = context
                    .frameBuffer
                    .getTextureFromCurrentAttachment();
            }

            // draw blur y
            if (this._$blurY > 0) {

                attachmentIndex = (attachmentIndex + 1) % 2;

                const yTexture = attachments[attachmentIndex];
                context._$bind(yTexture);

                context._$applyBlurFilter(targetTexture, false, bufferBlurY);

                targetTexture = context
                    .frameBuffer
                    .getTextureFromCurrentAttachment();
            }
        }

        // reset alpha
        context.blend.reset();

        if (bufferScaleX !== 1 || bufferScaleY !== 1) {

            const resultAttachment = context
                .frameBuffer
                .createTextureAttachment(width, height);
            context._$bind(resultAttachment);

            Util.$resetContext(context);
            context.imageSmoothingEnabled = true;
            context.setTransform(1 / bufferScaleX, 0, 0, 1 / bufferScaleY, 0, 0);
            context.drawImage(targetTexture, 0, 0, bufferWidth, bufferHeight);

            targetTexture = context
                .frameBuffer
                .getTextureFromCurrentAttachment();

            Util.$resetContext(context);
            context.setTransform(1, 0, 0, 1, 0, 0);

            context
                .frameBuffer
                .releaseAttachment(attachments[0], true);

            context
                .frameBuffer
                .releaseAttachment(attachments[1], true);

            if (removed) {
                context
                    .frameBuffer
                    .releaseAttachment(currentAttachment, true);
            } else {
                context
                    .frameBuffer
                    .releaseAttachment(resultAttachment, false);
            }

        } else {

            // 最終結果ではない方のAttachmentを解放する
            context
                .frameBuffer
                .releaseAttachment(attachments[(attachmentIndex + 1) % 2], true);

            if (removed) {
                // 適用前のAttachmentを解放する
                context
                    .frameBuffer
                    .releaseAttachment(currentAttachment, true);
            } else {
                // 適用後のAttachmentを解放する
                context
                    .frameBuffer
                    .releaseAttachment(attachments[attachmentIndex], false);
            }
        }

        return targetTexture;
    }
}