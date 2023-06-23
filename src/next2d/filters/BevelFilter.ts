import { BitmapFilter } from "./BitmapFilter";
import { BlurFilter } from "./BlurFilter";
import type { BitmapFilterTypeImpl } from "../../interface/BitmapFilterTypeImpl";
import type { Rectangle } from "../geom/Rectangle";
import type { CanvasToWebGLContext } from "../../webgl/CanvasToWebGLContext";
import type { AttachmentImpl } from "../../interface/AttachmentImpl";
import type { FilterQualityImpl } from "../../interface/FilterQualityImpl";
import type { FrameBufferManager } from "../../webgl/FrameBufferManager";
import {
    $Math,
    $clamp,
    $toColorInt,
    $getArray,
    $Deg2Rad,
    $intToR,
    $intToG,
    $intToB
} from "../../util/RenderUtil";

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
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class BevelFilter extends BitmapFilter
{
    private _$blurFilter: BlurFilter;
    private _$distance: number;
    private _$angle: number;
    private _$highlightColor: number;
    private _$highlightAlpha: number;
    private _$shadowColor: number;
    private _$shadowAlpha: number;
    private _$strength: number;
    private _$type: BitmapFilterTypeImpl;
    private _$knockout: boolean;

    /**
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
        distance: number = 4, angle: number = 45,
        highlight_color: number = 0xffffff, highlight_alpha: number = 1,
        shadow_color: number = 0, shadow_alpha: number = 1,
        blur_x: number = 4, blur_y: number = 4,
        strength: number = 1, quality: FilterQualityImpl = 1,
        type: BitmapFilterTypeImpl = "inner", knockout: boolean = false
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
         * @default 0xffffff
         * @private
         */
        this._$highlightColor = 0xffffff;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$highlightAlpha = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$shadowColor = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$shadowAlpha = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$strength = 1;

        /**
         * @type {string}
         * @default "inner"
         * @private
         */
        this._$type = "inner";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$knockout = false;

        // setup
        this.distance       = distance;
        this.angle          = angle;
        this.highlightColor = highlight_color;
        this.highlightAlpha = highlight_alpha;
        this.shadowColor    = shadow_color;
        this.shadowAlpha    = shadow_alpha;
        this.strength       = strength;
        this.type           = type;
        this.knockout       = knockout;
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
    static toString (): string
    {
        return "[class BevelFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.BevelFilter
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.filters.BevelFilter";
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
    toString (): string
    {
        return "[object BevelFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.BevelFilter
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.filters.BevelFilter";
    }

    /**
     * @description シャドウの角度
     *              The angle of the shadow.
     *
     * @member  {number}
     * @default 45
     * @public
     */
    get angle (): number
    {
        return this._$angle;
    }
    set angle (angle: number)
    {
        angle %= 360;
        if (angle !== this._$angle) {
            this._$angle = $clamp(angle, -360, 360, 45);
            this._$doChanged();
        }
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
        return this._$blurFilter.blurX;
    }
    set blurX (blur_x: number)
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
    get blurY (): number
    {
        return this._$blurFilter.blurY;
    }
    set blurY (blur_y: number)
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
    get distance (): number
    {
        return this._$distance;
    }
    set distance (distance: number)
    {
        distance = $clamp(+distance, -255, 255, 4);
        if (distance !== this._$distance) {
            this._$distance = distance;
            this._$doChanged();
        }
    }

    /**
     * @description アルファ透明度の値です。
     *              The alpha transparency value for the color.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get highlightAlpha (): number
    {
        return this._$highlightAlpha;
    }
    set highlightAlpha (highlight_alpha: number)
    {
        highlight_alpha = $clamp(+highlight_alpha, 0, 1, 0);
        if (highlight_alpha !== this._$highlightAlpha) {
            this._$highlightAlpha = highlight_alpha;
            this._$doChanged();
        }
    }

    /**
     * @description グローのカラー
     *              The color of the glow.
     *
     * @member  {number}
     * @default 0xffffff
     * @public
     */
    get highlightColor (): number
    {
        return this._$highlightColor;
    }
    set highlightColor (highlight_color: number)
    {
        highlight_color = $clamp(
            $toColorInt(highlight_color), 0, 0xffffff, 0xffffff
        );
        if (highlight_color !== this._$highlightColor) {
            this._$highlightColor = highlight_color;
            this._$doChanged();
        }
    }

    /**
     * @description オブジェクトにノックアウト効果を適用するかどうか
     *              Specifies whether the object has a knockout effect.
     *
     * @member  {boolean}
     * @default false
     * @public
     */
    get knockout (): boolean
    {
        return this._$knockout;
    }
    set knockout (knockout: boolean)
    {
        if (knockout !== this._$knockout) {
            this._$knockout = !!knockout;
            this._$doChanged();
        }
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
        return this._$blurFilter.quality;
    }
    set quality (quality: FilterQualityImpl)
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
    get shadowAlpha (): number
    {
        return this._$shadowAlpha;
    }
    set shadowAlpha (shadow_alpha: number)
    {
        shadow_alpha = $clamp(+shadow_alpha, 0, 1, 0);
        if (shadow_alpha !== this._$shadowAlpha) {
            this._$shadowAlpha = shadow_alpha;
            this._$doChanged();
        }
    }

    /**
     * @description グローのカラー
     *              The color of the glow.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get shadowColor (): number
    {
        return this._$shadowColor;
    }
    set shadowColor (shadow_color: number)
    {
        shadow_color = $clamp(
            $toColorInt(shadow_color), 0, 0xffffff, 0
        );

        if (shadow_color !== this._$shadowColor) {
            this._$shadowColor = shadow_color;
            this._$doChanged();
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
    get strength (): number
    {
        return this._$strength;
    }
    set strength (strength: number)
    {
        strength = $clamp(strength | 0, 0, 255, 0);
        if (strength !== this._$strength) {
            this._$strength = strength;
            this._$doChanged();
        }
    }

    /**
     * @description オブジェクトでのベベルの配置
     *              The placement of the bevel on the object.
     *
     * @member  {string}
     * @default BitmapFilterType.INNER
     * @public
     */
    get type (): BitmapFilterTypeImpl
    {
        return this._$type;
    }
    set type (type: BitmapFilterTypeImpl)
    {
        type = `${type}`;
        if (type !== this._$type) {
            this._$type = type;
            this._$doChanged();
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
    clone (): BevelFilter
    {
        return new BevelFilter(
            this._$distance, this._$angle, this._$highlightColor, this._$highlightAlpha,
            this._$shadowColor, this._$shadowAlpha, this._$blurFilter.blurX, this._$blurFilter.blurY,
            this._$strength, this._$blurFilter.quality, this._$type, this._$knockout
        );
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    _$toArray (): any[]
    {
        return $getArray(0,
            this._$distance, this._$angle, this._$highlightColor, this._$highlightAlpha,
            this._$shadowColor, this._$shadowAlpha, this._$blurFilter.blurX, this._$blurFilter.blurY,
            this._$strength, this._$blurFilter.quality, this._$type, this._$knockout
        );
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$isUpdated (): boolean
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
    _$generateFilterRect (
        rect: Rectangle,
        x_scale: number = 0,
        y_scale: number = 0
    ): Rectangle {

        let clone: Rectangle = rect.clone();
        if (!this._$canApply()) {
            return clone;
        }

        clone = this
            ._$blurFilter
            ._$generateFilterRect(clone, x_scale, y_scale);

        const radian: number = this._$angle * $Deg2Rad;
        const x: number      = $Math.abs($Math.cos(radian) * this._$distance);
        const y: number      = $Math.abs($Math.sin(radian) * this._$distance);

        clone.x      += -x;
        clone.width  += x;
        clone.y      += -y;
        clone.height += y * 2;

        return clone;
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply (): boolean
    {
        return this._$strength > 0
            && this._$distance !== 0
            && this._$blurFilter._$canApply();
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array}  matrix
     * @return {WebGLTexture}
     * @private
     */
    _$applyFilter (
        context: CanvasToWebGLContext,
        matrix: Float32Array
    ): WebGLTexture {

        this._$updated = false;

        const manager: FrameBufferManager = context.frameBuffer;

        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        if (!currentAttachment) {
            throw new Error("the current attachment is null.");
        }

        // reset
        context.setTransform(1, 0, 0, 1, 0, 0);

        const baseTexture: WebGLTexture = manager
            .getTextureFromCurrentAttachment();

        if (!this._$canApply()) {
            return baseTexture;
        }

        const baseWidth: number   = currentAttachment.width;
        const baseHeight: number  = currentAttachment.height;
        const baseOffsetX: number = context._$offsetX;
        const baseOffsetY: number = context._$offsetY;

        // matrix to scale
        const xScale: number = $Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale: number = $Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        // pointer
        const radian: number = this._$angle * $Deg2Rad;
        const x: number = $Math.cos(radian) * this._$distance * xScale;
        const y: number = $Math.sin(radian) * this._$distance * yScale;

        // highlight buffer
        const highlightTextureBaseAttachment: AttachmentImpl = manager
            .createTextureAttachment(baseWidth, baseHeight);

        context._$bind(highlightTextureBaseAttachment);

        context.reset();
        context.drawImage(baseTexture, 0, 0, baseWidth, baseHeight);

        context.globalCompositeOperation = "erase";
        context.drawImage(baseTexture, x * 2, y * 2, baseWidth, baseHeight);

        const highlightTextureBase = this
            ._$blurFilter
            ._$applyFilter(context, matrix, false);

        const blurWidth   = highlightTextureBase.width;
        const blurHeight  = highlightTextureBase.height;
        const bevelWidth  = $Math.ceil(blurWidth  + $Math.abs(x) * 2);
        const bevelHeight = $Math.ceil(blurHeight + $Math.abs(y) * 2);

        // bevel filter buffer
        const isInner: boolean = this._$type === "inner";
        const width: number    = isInner ? baseWidth  : bevelWidth;
        const height: number   = isInner ? baseHeight : bevelHeight;

        const absX: number = $Math.abs(x);
        const absY: number = $Math.abs(y);
        const blurOffsetX: number = (blurWidth  - baseWidth)  / 2;
        const blurOffsetY: number = (blurHeight - baseHeight) / 2;

        const baseTextureX: number = isInner ? 0 : absX + blurOffsetX;
        const baseTextureY: number = isInner ? 0 : absY + blurOffsetY;
        const blurTextureX: number = isInner ? -blurOffsetX - x : absX - x;
        const blurTextureY: number = isInner ? -blurOffsetY - y : absY - y;

        context._$bind(currentAttachment);

        // TODO 後で確認
        manager.releaseAttachment(highlightTextureBaseAttachment, true);

        context._$applyBitmapFilter(
            highlightTextureBase, width, height,
            baseWidth, baseHeight, baseTextureX, baseTextureY,
            blurWidth, blurHeight, blurTextureX, blurTextureY,
            false, this._$type, this._$knockout,
            this._$strength, null, null, null,
            $intToR(this._$highlightColor, this._$highlightAlpha, true),
            $intToG(this._$highlightColor, this._$highlightAlpha, true),
            $intToB(this._$highlightColor, this._$highlightAlpha, true),
            this._$highlightAlpha,
            $intToR(this._$shadowColor, this._$shadowAlpha, true),
            $intToG(this._$shadowColor, this._$shadowAlpha, true),
            $intToB(this._$shadowColor, this._$shadowAlpha, true),
            this._$shadowAlpha
        );

        context._$offsetX = baseOffsetX + baseTextureX;
        context._$offsetY = baseOffsetY + baseTextureY;

        manager.releaseTexture(highlightTextureBase);

        return manager.getTextureFromCurrentAttachment();
    }
}
