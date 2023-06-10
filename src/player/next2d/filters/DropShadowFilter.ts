import { BitmapFilter } from "./BitmapFilter";
import { BlurFilter } from "./BlurFilter";
import { FilterQualityImpl } from "../../../interface/FilterQualityImpl";
import { Rectangle } from "../geom/Rectangle";
import { FrameBufferManager } from "../../../webgl/FrameBufferManager";
import { CanvasToWebGLContext } from "../../../webgl/CanvasToWebGLContext";
import { AttachmentImpl } from "../../../interface/AttachmentImpl";
import { $devicePixelRatio } from "../../util/Shortcut";
import { BitmapFilterTypeImpl } from "../../../interface/BitmapFilterTypeImpl";
import {
    $clamp,
    $Deg2Rad,
    $getArray,
    $Math,
    $toColorInt,
    $intToR,
    $intToG,
    $intToB
} from "../../util/RenderUtil";

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
export class DropShadowFilter extends BitmapFilter
{
    private _$blurFilter: BlurFilter;
    private _$distance: number;
    private _$angle: number;
    private _$color: number;
    private _$alpha: number;
    private _$strength: number;
    private _$inner: boolean;
    private _$knockout: boolean;
    private _$hideObject: boolean;

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
        distance: number = 4, angle: number = 45,
        color: number = 0, alpha: number = 1,
        blur_x: number = 4, blur_y: number = 4,
        strength: number = 1, quality: FilterQualityImpl = 1,
        inner: boolean = false, knockout: boolean = false,
        hide_object: boolean = false
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
    static toString (): string
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
    static get namespace (): string
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
    toString (): string
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
    get namespace (): string
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
            this._$doChanged();
        }
        this._$angle = $clamp(angle, -360, 360, 45);
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
        color = $clamp(
            $toColorInt(color), 0, 0xffffff, 0
        );

        if (color !== this._$color) {
            this._$doChanged();
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
    get distance (): number
    {
        return this._$distance;
    }
    set distance (distance: number)
    {
        distance = $clamp(+distance, -255, 255, 4);
        if (distance !== this._$distance) {
            this._$doChanged();
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
    get hideObject (): boolean
    {
        return this._$hideObject;
    }
    set hideObject (hide_object: boolean)
    {
        if (hide_object !== this._$hideObject) {
            this._$doChanged();
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
     * @return {DropShadowFilter}
     * @method
     * @public
     */
    clone (): DropShadowFilter
    {
        return new DropShadowFilter(
            this._$distance, this._$angle, this._$color, this._$alpha,
            this._$blurFilter.blurX, this._$blurFilter.blurY, this._$strength,
            this._$blurFilter.quality, this._$inner, this._$knockout, this._$hideObject
        );
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    _$toArray (): any[]
    {
        return $getArray(5,
            this._$distance, this._$angle, this._$color, this._$alpha,
            this._$blurFilter.blurX, this._$blurFilter.blurY, this._$strength,
            this._$blurFilter.quality, this._$inner, this._$knockout, this._$hideObject
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

        const radian = this._$angle * $Deg2Rad;
        const x      = $Math.cos(radian) * this._$distance * 2;
        const y      = $Math.sin(radian) * this._$distance * 2;

        clone.x      = $Math.min(clone.x, x);
        clone.width  += $Math.abs(x);
        clone.y      = $Math.min(clone.y, y);
        clone.height += $Math.abs(y);

        return clone;
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply (): boolean
    {
        return this._$alpha > 0 && this._$strength > 0 && this._$blurFilter._$canApply();
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$applyFilter (context: CanvasToWebGLContext, matrix: Float32Array)
    {
        const manager: FrameBufferManager = context.frameBuffer;

        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;
        if (!currentAttachment) {
            throw new Error("the current attachment is null.");
        }

        // reset
        context.setTransform(1, 0, 0, 1, 0, 0);

        if (!this._$canApply()) {
            return manager.getTextureFromCurrentAttachment();
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

        const offsetDiffX: number = blurOffsetX - baseOffsetX;
        const offsetDiffY: number = blurOffsetY - baseOffsetY;

        const xScale: number = $Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale: number = $Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        // shadow point
        const radian: number = this._$angle * $Deg2Rad;
        const x: number = $Math.cos(radian) * this._$distance * 2 * xScale / $devicePixelRatio;
        const y: number = $Math.sin(radian) * this._$distance * 2 * yScale / $devicePixelRatio;

        // dropShadow canvas
        const w: number = this._$inner ? baseWidth  : blurWidth  + $Math.max(0, $Math.abs(x) - offsetDiffX);
        const h: number = this._$inner ? baseHeight : blurHeight + $Math.max(0, $Math.abs(y) - offsetDiffY);
        const width: number  = $Math.ceil(w);
        const height: number = $Math.ceil(h);
        const fractionX: number = (width  - w) / 2;
        const fractionY: number = (height - h) / 2;

        const baseTextureX = this._$inner ? 0 : $Math.max(0, offsetDiffX - x) + fractionX;
        const baseTextureY = this._$inner ? 0 : $Math.max(0, offsetDiffY - y) + fractionY;
        const blurTextureX = this._$inner ? x - blurOffsetX : (x > 0 ? $Math.max(0, x - offsetDiffX) : 0) + fractionX;
        const blurTextureY = this._$inner ? y - blurOffsetY : (y > 0 ? $Math.max(0, y - offsetDiffY) : 0) + fractionY;

        let type: BitmapFilterTypeImpl;
        let knockout: boolean;
        if (this._$inner) {
            type = "inner";
            knockout = this._$knockout || this._$hideObject;
        } else if (!this._$knockout && this._$hideObject) {
            type = "full";
            knockout = true;
        } else {
            type = "outer";
            knockout = this._$knockout;
        }

        context._$bind(currentAttachment);
        context._$applyBitmapFilter(
            blurTexture, width, height,
            baseWidth, baseHeight, baseTextureX, baseTextureY,
            blurWidth, blurHeight, blurTextureX, blurTextureY,
            true, type, knockout,
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
