import { BitmapFilter } from "./BitmapFilter";
import { BlurFilter } from "./BlurFilter";
import type { Rectangle } from "@next2d/geom";
import {
    FilterQualityImpl,
    BitmapFilterTypeImpl,
    AttachmentImpl
} from "@next2d/interface";
import {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import {
    $Array,
    $clamp,
    $Deg2Rad,
    $getArray,
    $Math,
    $toColorInt
} from "@next2d/share";

/**
 * GradientGlowFilter クラスを使用すると、表示オブジェクトにグラデーショングロー効果を適用できます。
 * グラデーショングローとは、制御可能なカラーグラデーションによるリアルな輝きです。
 * グラデーショングローは、オブジェクトの内側エッジや外側エッジの周囲、またはオブジェクトの上に適用できます。
 *
 * The GradientGlowFilter class lets you apply a gradient glow effect to display objects.
 * A gradient glow is a realistic-looking glow with a color gradient that you can control.
 * You can apply a gradient glow around the inner or outer edge of an object or on top of an object.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class GradientGlowFilter extends BitmapFilter
{
    private _$blurFilter: BlurFilter;
    private _$distance: number;
    private _$angle: number;
    private _$colors: number[] | null;
    private _$alphas: number[] | null;
    private _$ratios: number[] | null;
    private _$strength: number;
    private _$type: BitmapFilterTypeImpl;
    private _$knockout: boolean;

    /**
     * @param {number}  [distance=4.0]
     * @param {number}  [angle=45]
     * @param {array}   [colors=null]
     * @param {array}   [alphas=null]
     * @param {array}   [ratios=null]
     * @param {number}  [blur_x=4.0]
     * @param {number}  [blur_y=4.0]
     * @param {number}  [strength=1]
     * @param {number}  [quality=1]
     * @param {string}  [type=BitmapFilterType.INNER]
     * @param {boolean} [knockout=false]
     *
     * @constructor
     * @public
     */
    constructor (
        distance: number = 4, angle: number = 45,
        colors: number[] | null = null,
        alphas: number[] | null = null,
        ratios: number[] | null = null,
        blur_x: number = 4, blur_y: number = 4, strength: number = 1,
        quality: FilterQualityImpl = 1,
        type: BitmapFilterTypeImpl = "inner",
        knockout: boolean = false
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
         * @type {array}
         * @default null
         * @private
         */
        this._$colors = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$alphas = null;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$ratios = null;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$strength = 1;

        /**
         * @type {string}
         * @default BitmapFilterType.INNER
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
        this.distance = distance;
        this.angle    = angle;
        this.colors   = colors;
        this.alphas   = alphas;
        this.ratios   = ratios;
        this.strength = strength;
        this.type     = type;
        this.knockout = knockout;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class GradientGlowFilter]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class GradientGlowFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.GradientGlowFilter
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.filters.GradientGlowFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object GradientGlowFilter]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object GradientGlowFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.GradientGlowFilter
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.filters.GradientGlowFilter";
    }

    /**
     * @description カラー配列内の各色に対応するアルファ透明度の値の配列です。
     *              An array of alpha transparency values
     *              for the corresponding colors in the colors array.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get alphas (): number[] | null
    {
        return this._$alphas;
    }
    set alphas (alphas: number[] | null)
    {
        if (alphas !== this._$alphas) {
            this._$alphas = alphas;
            if ($Array.isArray(alphas)) {

                for (let idx: number = 0; idx < alphas.length; ++idx) {
                    alphas[idx] = $clamp(+alphas[idx], 0, 1, 0);
                }

                this._$alphas = alphas;
            }
            this._$doChanged();
        }
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
        angle = $clamp(angle % 360, -360, 360, 45);
        if (angle !== this._$angle) {
            this._$angle = angle;
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
     * @description グラデーションで使用する RGB 16 進数カラー値の配列です。
     *              An array of RGB hexadecimal color values to use in the gradient.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get colors (): number[] | null
    {
        return this._$colors;
    }
    set colors (colors: number[] | null)
    {
        if (this._$colors !== colors) {
            this._$colors = colors;
            if ($Array.isArray(colors)) {

                for (let idx: number = 0; idx < colors.length; ++idx) {
                    colors[idx] = $clamp(
                        $toColorInt(colors[idx]), 0, 0xffffff, 0
                    );
                }

                this._$colors = colors;
            }
            this._$doChanged();
        }
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
     * @description カラー配列内の対応するカラーの色分布比率の配列です。
     *              An array of color distribution ratios
     *              for the corresponding colors in the colors array.
     *
     * @member  {array}
     * @default null
     * @public
     */
    get ratios (): number[] | null
    {
        return this._$ratios;
    }
    set ratios (ratios: number[] | null)
    {
        if (this._$ratios !== ratios) {
            this._$ratios = ratios;
            if ($Array.isArray(ratios)) {

                for (let idx: number = 0; idx < ratios.length; ++idx) {
                    ratios[idx] = $clamp(+ratios[idx], 0, 255, 0);
                }

                this._$ratios = ratios;
            }
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
        if (type !== this._$type) {
            this._$type = type;
            this._$doChanged();
        }
    }

    /**
     * @description オブジェクトのコピーを返します。
     *              Returns a copy of this filter object.
     *
     * @return {GradientGlowFilter}
     * @method
     * @public
     */
    clone (): GradientGlowFilter
    {
        return new GradientGlowFilter(
            this._$distance, this._$angle, this._$colors, this._$alphas, this._$ratios,
            this._$blurFilter.blurX, this._$blurFilter.blurY, this._$strength,
            this._$blurFilter.quality, this._$type, this._$knockout
        );
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    _$toArray (): any[]
    {
        return $getArray(8,
            this._$distance, this._$angle, this._$colors, this._$alphas, this._$ratios,
            this._$blurFilter.blurX, this._$blurFilter.blurY, this._$strength,
            this._$blurFilter.quality, this._$type, this._$knockout
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
    ): Rectangle
    {
        let clone: Rectangle = rect.clone();
        if (!this._$canApply()) {
            return clone;
        }

        clone = this._$blurFilter._$generateFilterRect(clone, x_scale, y_scale);

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
     /**
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply (): boolean
    {
        return this._$strength > 0 && this._$distance > 0
            && this._$alphas !== null && this._$ratios !== null && this._$colors !== null
            && this._$blurFilter._$canApply();
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {array}  matrix
     * @return {WebGLTexture}
     * @method
     * @private
     */
    _$applyFilter (
        context: CanvasToWebGLContext,
        matrix: Float32Array
    ): WebGLTexture {

        this._$updated = false;

        const manager: FrameBufferManager = context.frameBuffer;

        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        // reset
        context.setTransform(1, 0, 0, 1, 0, 0);

        if (!this._$canApply() || !currentAttachment) {
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

        // matrix to scale
        const xScale: number = $Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale: number = $Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        // shadow point
        const radian: number = +(this._$angle * $Deg2Rad);
        const x: number = +($Math.cos(radian) * this._$distance * xScale);
        const y: number = +($Math.sin(radian) * this._$distance * yScale);

        const isInner: boolean = this.type === "inner";
        const w: number = isInner ? baseWidth  : blurWidth  + $Math.max(0, $Math.abs(x) - offsetDiffX);
        const h: number = isInner ? baseHeight : blurHeight + $Math.max(0, $Math.abs(y) - offsetDiffY);
        const width: number  = $Math.ceil(w);
        const height: number = $Math.ceil(h);
        const fractionX: number = (width  - w) / 2;
        const fractionY: number = (height - h) / 2;

        const baseTextureX = isInner ? 0 : $Math.max(0, offsetDiffX - x) + fractionX;
        const baseTextureY = isInner ? 0 : $Math.max(0, offsetDiffY - y) + fractionY;
        const blurTextureX = isInner ? x - blurOffsetX : (x > 0 ? $Math.max(0, x - offsetDiffX) : 0) + fractionX;
        const blurTextureY = isInner ? y - blurOffsetY : (y > 0 ? $Math.max(0, y - offsetDiffY) : 0) + fractionY;

        context._$bind(currentAttachment);
        context._$applyBitmapFilter(
            blurTexture, width, height,
            baseWidth, baseHeight, baseTextureX, baseTextureY,
            blurWidth, blurHeight, blurTextureX, blurTextureY,
            true, this._$type, this._$knockout,
            this._$strength, this._$ratios, this._$colors, this._$alphas,
            0, 0, 0, 0, 0, 0, 0, 0
        );

        context._$offsetX = baseOffsetX + baseTextureX;
        context._$offsetY = baseOffsetY + baseTextureY;

        manager.releaseTexture(blurTexture);

        return manager.getTextureFromCurrentAttachment();
    }
}
