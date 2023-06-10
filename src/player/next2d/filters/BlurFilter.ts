import { BitmapFilter } from "./BitmapFilter";
import { FilterQualityImpl } from "../../../interface/FilterQualityImpl";
import { Rectangle } from "../geom/Rectangle";
import { CanvasToWebGLContext } from "../../../webgl/CanvasToWebGLContext";
import { FrameBufferManager } from "../../../webgl/FrameBufferManager";
import { AttachmentImpl } from "../../../interface/AttachmentImpl";
import {
    $Math,
    $getArray,
    $clamp
} from "../../util/RenderUtil";

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
export class BlurFilter extends BitmapFilter
{
    private _$blurX: number;
    private _$blurY: number;
    private _$quality: FilterQualityImpl;

    /**
     * @param {number}  [blur_x=4]
     * @param {number}  [blur_y=4]
     * @param {int}     [quality=1]
     *
     * @constructor
     * @public
     */
    constructor (blur_x: number = 4, blur_y: number = 4, quality: FilterQualityImpl = 1)
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
    static toString (): string
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
    static get namespace (): string
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
    toString (): string
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
     * @public
     */
    get namespace (): string
    {
        return "next2d.filters.BlurFilter";
    }

    /**
     * @return {array}
     * @private
     */
    static get STEP (): number[]
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
    get blurX (): number
    {
        return this._$blurX;
    }
    set blurX (blur_x: number)
    {
        blur_x = $clamp(+blur_x, 0, 255, 0);
        if (blur_x !== this._$blurX) {
            this._$doChanged();
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
    get blurY (): number
    {
        return this._$blurY;
    }
    set blurY (blur_y: number)
    {
        blur_y = $clamp(+blur_y, 0, 255, 0);
        if (blur_y !== this._$blurY) {
            this._$doChanged();
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
    get quality (): FilterQualityImpl
    {
        return this._$quality;
    }
    set quality (quality: FilterQualityImpl)
    {
        if (quality !== this._$quality) {
            this._$doChanged();
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
    clone (): BlurFilter
    {
        return new BlurFilter(this._$blurX, this._$blurY, this._$quality);
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    _$toArray (): any[]
    {
        return $getArray(1,
            this._$blurX, this._$blurY, this._$quality
        );
    }

    /**
     * @param  {Rectangle} rect
     * @param  {number}    [x_scale=0]
     * @param  {number}    [y_scale=0]
     * @return {Rectangle}
     * @method
     * @private
     */
    _$generateFilterRect (
        rect: Rectangle,
        x_scale: number = 0, y_scale: number = 0
    ): Rectangle {

        const clone = rect.clone();

        if (!this._$quality) {
            return clone;
        }

        const step = BlurFilter.STEP[this._$quality - 1];

        let dx = 0 >= this._$blurX ? 1 : this._$blurX * step;
        let dy = 0 >= this._$blurY ? 1 : this._$blurY * step;

        if (x_scale) {
            dx *= x_scale;
        } else {
            dx = $Math.round(dx);
        }

        if (y_scale) {
            dy *= y_scale;
        } else {
            dy = $Math.round(dy);
        }

        clone.x      -= dx;
        clone.width  += dx * 2;
        clone.y      -= dy;
        clone.height += dy * 2;

        return clone;
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply (): boolean
    {
        return this._$blurX !== 0 && this._$blurY !== 0;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {boolean} [removed=true]
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$applyFilter (
        context: CanvasToWebGLContext,
        matrix: Float32Array,
        removed: boolean = true
    ): WebGLTexture {

        this._$updated = false;

        const manager: FrameBufferManager = context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        const baseTexture: WebGLTexture = manager
            .getTextureFromCurrentAttachment();

        if (!this._$canApply()) {

            if (removed) {
                return baseTexture;
            }

            return manager
                .createTextureFromCurrentAttachment();
        }

        // matrix to scale
        const xScale: number = $Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale: number = $Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        // after size
        const baseRect: Rectangle = new Rectangle(0, 0, baseTexture.width, baseTexture.height);
        const rect: Rectangle = this._$generateFilterRect(baseRect, xScale, yScale);

        const width: number   = $Math.ceil(rect.width) | 0;
        const height: number  = $Math.ceil(rect.height) | 0;
        const offsetX: number = $Math.ceil($Math.abs(rect.x) + $Math.abs(width  - rect.width)  * 0.5);
        const offsetY: number = $Math.ceil($Math.abs(rect.y) + $Math.abs(height - rect.height) * 0.5);

        // set offset xy
        context._$offsetX = offsetX + context._$offsetX;
        context._$offsetY = offsetY + context._$offsetY;

        const baseBlurX: number = this._$blurX * xScale;
        const baseBlurY: number = this._$blurY * yScale;

        let bufferScaleX: number = 1;
        let bufferScaleY: number = 1;

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

        const bufferBlurX: number = baseBlurX * bufferScaleX;
        const bufferBlurY: number = baseBlurY * bufferScaleY;

        const bufferWidth: number  = $Math.ceil(width  * bufferScaleX);
        const bufferHeight: number = $Math.ceil(height * bufferScaleY);

        const attachment0 = manager
            .createTextureAttachment(bufferWidth, bufferHeight);

        const attachment1 = manager
            .createTextureAttachment(bufferWidth, bufferHeight);

        const attachments: AttachmentImpl[] = [attachment0, attachment1];
        let attachmentIndex: number = 0;

        context._$bind(attachment0);

        // draw
        context.reset();
        context.setTransform(bufferScaleX, 0, 0, bufferScaleY, 0, 0);
        context.drawImage(
            baseTexture, offsetX, offsetY,
            baseTexture.width, baseTexture.height
        );

        // set alpha
        context.blend.toOneZero();

        // execute
        let targetTexture: WebGLTexture = manager.getTextureFromCurrentAttachment();
        for (let q: number = 0; q < this._$quality; ++q) {

            // draw blur x
            if (this._$blurX > 0) {

                attachmentIndex = (attachmentIndex + 1) % 2;

                const xTexture: AttachmentImpl = attachments[attachmentIndex];
                context._$bind(xTexture);

                context
                    ._$applyBlurFilter(
                        targetTexture, true, bufferBlurX
                    );

                targetTexture = manager.getTextureFromCurrentAttachment();
            }

            // draw blur y
            if (this._$blurY > 0) {

                attachmentIndex = (attachmentIndex + 1) % 2;

                const yTexture: AttachmentImpl = attachments[attachmentIndex];
                context._$bind(yTexture);

                context
                    ._$applyBlurFilter(
                        targetTexture, false, bufferBlurY
                    );

                targetTexture = manager.getTextureFromCurrentAttachment();
            }
        }

        // reset alpha
        context.blend.reset();

        if (bufferScaleX !== 1 || bufferScaleY !== 1) {

            const resultAttachment: AttachmentImpl = manager
                .createTextureAttachment(width, height);

            context._$bind(resultAttachment);

            context.reset();
            context.imageSmoothingEnabled = true;
            context.setTransform(1 / bufferScaleX, 0, 0, 1 / bufferScaleY, 0, 0);
            context.drawImage(targetTexture, 0, 0, bufferWidth, bufferHeight);

            targetTexture = manager.getTextureFromCurrentAttachment();

            context.reset();
            context.setTransform(1, 0, 0, 1, 0, 0);

            manager
                .releaseAttachment(attachments[0], true);

            manager
                .releaseAttachment(attachments[1], true);

            if (removed) {
                manager
                    .releaseAttachment(currentAttachment, true);
            } else {
                manager
                    .releaseAttachment(resultAttachment, false);
            }

        } else {

            // 最終結果ではない方のAttachmentを解放する
            manager
                .releaseAttachment(attachments[(attachmentIndex + 1) % 2], true);

            if (removed) {
                // 適用前のAttachmentを解放する
                manager
                    .releaseAttachment(currentAttachment, true);
            } else {
                // 適用後のAttachmentを解放する
                manager
                    .releaseAttachment(attachments[attachmentIndex], false);
            }
        }

        return targetTexture;
    }
}
