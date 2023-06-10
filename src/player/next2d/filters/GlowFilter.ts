import { BitmapFilter } from "./BitmapFilter";
import { BlurFilter } from "./BlurFilter";
import { FilterQualityImpl } from "../../../interface/FilterQualityImpl";
import { Rectangle } from "../geom/Rectangle";
import { CanvasToWebGLContext } from "../../../webgl/CanvasToWebGLContext";
import { AttachmentImpl } from "../../../interface/AttachmentImpl";
import { BitmapFilterTypeImpl } from "../../../interface/BitmapFilterTypeImpl";
import { FrameBufferManager } from "../../../webgl/FrameBufferManager";
import {
    $intToB,
    $intToG,
    $intToR,
    $clamp,
    $toColorInt,
    $getArray
} from "../../util/RenderUtil";

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
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class GlowFilter extends BitmapFilter
{
    private readonly _$blurFilter: BlurFilter;
    private _$color: number;
    private _$alpha: number;
    private _$strength: number;
    private _$inner: boolean;
    private _$knockout: boolean;

    /**
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
        color: number = 0, alpha: number = 1,
        blur_x: number = 4, blur_y: number = 4,
        strength: number = 1, quality: FilterQualityImpl = 1,
        inner: boolean = false, knockout: boolean = false
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

        // setup
        this.color    = color;
        this.alpha    = alpha;
        this.strength = strength;
        this.inner    = inner;
        this.knockout = knockout;
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
    static toString (): string
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
    static get namespace (): string
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
    toString (): string
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
     * @public
     */
    get namespace (): string
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
    get alpha (): number
    {
        return this._$alpha;
    }
    set alpha (alpha: number)
    {
        alpha = $clamp(+alpha, 0, 1, 0);
        if (alpha !== this._$alpha) {
            this._$doChanged();
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
     * @description グローのカラー
     *              The color of the glow.
     *
     * @member  {number}
     * @default 4
     * @public
     */
    get color (): number
    {
        return this._$color;
    }
    set color (color: number)
    {
        color = $clamp($toColorInt(color), 0, 0xffffff, 4);

        if (color !== this._$color) {
            this._$doChanged();
        }

        this._$color = color;
    }

    /**
     * @description グローが内側グローであるかどうか
     *              Specifies whether the glow is an inner glow.
     *
     * @member  {boolean}
     * @default true
     * @public
     */
    get inner (): boolean
    {
        return this._$inner;
    }
    set inner (inner: boolean)
    {
        if (inner !== this._$inner) {
            this._$doChanged();
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
    get knockout (): boolean
    {
        return this._$knockout;
    }
    set knockout (knockout: boolean)
    {
        if (knockout !== this._$knockout) {
            this._$doChanged();
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
    get quality (): FilterQualityImpl
    {
        return this._$blurFilter.quality;
    }
    set quality (quality: FilterQualityImpl)
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
    get strength (): number
    {
        return this._$strength;
    }
    set strength (strength: number)
    {
        strength = $clamp(strength | 0, 0, 255, 0);
        if (strength !== this._$strength) {
            this._$doChanged();
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
    clone (): GlowFilter
    {
        return new GlowFilter(
            this._$color, this._$alpha, this._$blurFilter.blurX, this._$blurFilter.blurY,
            this._$strength, this._$blurFilter.quality, this._$inner, this._$knockout
        );
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    _$toArray (): any[]
    {
        return $getArray(6,
            this._$color, this._$alpha, this._$blurFilter.blurX, this._$blurFilter.blurY,
            this._$strength, this._$blurFilter.quality, this._$inner, this._$knockout
        );
    }

    /**
     * @return {boolean}
     * @method
     * @public
     */
    _$isUpdated (): boolean
    {
        return this._$updated || this._$blurFilter._$isUpdated();
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
        x_scale: number = 0,
        y_scale: number = 0
    ): Rectangle {

        const clone: Rectangle = rect.clone();
        if (!this._$canApply()) {
            return clone;
        }

        return this
            ._$blurFilter
            ._$generateFilterRect(clone, x_scale, y_scale);
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply (): boolean
    {
        return this._$alpha > 0
            && this._$strength > 0
            && this._$blurFilter._$canApply();
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {array}  matrix
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$applyFilter (context: CanvasToWebGLContext, matrix: Float32Array): WebGLTexture
    {
        const manager: FrameBufferManager = context.frameBuffer;

        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        if (!currentAttachment) {
            throw new Error("the current attachment is null.");
        }

        this._$updated = false;

        // reset
        context.setTransform(1, 0, 0, 1, 0, 0);

        if (!this._$canApply()) {
            return manager
                .getTextureFromCurrentAttachment();
        }

        const baseWidth: number   = currentAttachment.width;
        const baseHeight: number  = currentAttachment.height;
        const baseOffsetX: number = context._$offsetX;
        const baseOffsetY: number = context._$offsetY;

        const blurTexture: WebGLTexture = this
            ._$blurFilter
            ._$applyFilter(context, matrix, false);

        const blurWidth: number   = blurTexture.width;
        const blurHeight: number  = blurTexture.height;
        const blurOffsetX: number = context._$offsetX;
        const blurOffsetY: number = context._$offsetY;

        const width: number  = this._$inner ? baseWidth  : blurWidth;
        const height: number = this._$inner ? baseHeight : blurHeight;

        const baseTextureX: number = this._$inner ? 0 : blurOffsetX - baseOffsetX;
        const baseTextureY: number = this._$inner ? 0 : blurOffsetY - baseOffsetY;
        const blurTextureX: number = this._$inner ? -blurOffsetX : 0;
        const blurTextureY: number = this._$inner ? -blurOffsetY : 0;

        const type: BitmapFilterTypeImpl = this._$inner
            ? "inner"
            : "outer";

        context._$bind(currentAttachment);
        context._$applyBitmapFilter(
            blurTexture, width, height,
            baseWidth, baseHeight, baseTextureX, baseTextureY,
            blurWidth, blurHeight, blurTextureX, blurTextureY,
            true, type, this._$knockout,
            this._$strength, null, null, null,
            $intToR(this._$color, this._$alpha, true),
            $intToG(this._$color, this._$alpha, true),
            $intToB(this._$color, this._$alpha, true),
            this._$alpha,
            0, 0, 0, 0
        );

        context._$offsetX = baseOffsetX + baseTextureX;
        context._$offsetY = baseOffsetY + baseTextureY;

        manager.releaseTexture(blurTexture);

        return manager.getTextureFromCurrentAttachment();
    }
}
