import { BitmapFilter } from "./BitmapFilter";
import { BlurFilter } from "./BlurFilter";
import type {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import type { AttachmentImpl } from "./interface/AttachmentImpl";
import type { FilterQualityImpl } from "./interface/FilterQualityImpl";
import type { BitmapFilterTypeImpl } from "./interface/BitmapFilterTypeImpl";
import type { BoundsImpl } from "./interface/BoundsImpl";
import {
    $Array,
    $clamp,
    $Deg2Rad,
    $devicePixelRatio,
    $getArray,
    $getBoundsObject,
    $Math,
    $toColorInt
} from "@next2d/share";

/**
 * GradientBevelFilter クラスを使用すると、オブジェクトにグラデーションベベル効果を適用し、表示できます。
 * グラデーションベベルは、オブジェクトの外側、内側、または上側が斜めになったエッジであり、グラデーションカラーで強調されます。
 * 斜めのエッジによってオブジェクトが 3 次元に見えます。
 *
 * The GradientBevelFilter class lets you apply a gradient bevel effect to display objects.
 * A gradient bevel is a beveled edge, enhanced with gradient color,
 * on the outside, inside, or top of an object.
 * Beveled edges make objects look three-dimensional.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class GradientBevelFilter  extends BitmapFilter
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
     * @default [class GradientBevelFilter]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class GradientBevelFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.GradientBevelFilter
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.filters.GradientBevelFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object GradientBevelFilter]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object GradientBevelFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.GradientBevelFilter
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.filters.GradientBevelFilter";
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
                    const alpha = alphas[idx];
                    alphas[idx] = $clamp(+alpha, 0, 1, 0);
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
     * @return {GradientBevelFilter}
     * @method
     * @public
     */
    clone (): GradientBevelFilter
    {
        return new GradientBevelFilter(
            this._$distance, this._$angle,
            this._$colors ? this._$colors.slice() : null,
            this._$alphas ? this._$alphas.slice() : null,
            this._$ratios ? this._$ratios.slice() : null,
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
        return $getArray(7,
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
     * @param  {object} bounds
     * @param  {number} [x_scale=0]
     * @param  {number} [y_scale=0]
     * @return {object}
     * @method
     * @private
     */
    _$generateFilterRect (
        bounds: BoundsImpl,
        x_scale: number = 0,
        y_scale: number = 0
    ): BoundsImpl {

        let clone: BoundsImpl = $getBoundsObject(
            bounds.xMin, bounds.xMax,
            bounds.yMin, bounds.yMax
        );

        if (!this._$canApply()) {
            return clone;
        }

        clone = this
            ._$blurFilter
            ._$generateFilterRect(clone, x_scale, y_scale);

        const radian: number = this._$angle * $Deg2Rad;

        let x: number = $Math.abs($Math.cos(radian) * this._$distance);
        let y: number = $Math.abs($Math.sin(radian) * this._$distance);

        if (x_scale) {
            x *= x_scale;
        }

        if (y_scale) {
            y *= y_scale;
        }

        clone.xMin = $Math.min(clone.xMin, x);
        if (x > 0) {
            clone.xMax += x;
        }
        clone.yMin = $Math.min(clone.yMin, y);
        if (y > 0) {
            clone.yMax += y;
        }

        return clone;
    }

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
     * @param  {Float32Array}  matrix
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

        const baseTexture: WebGLTexture = manager
            .getTextureFromCurrentAttachment();

        if (!this._$canApply() || !currentAttachment) {
            return baseTexture;
        }

        const baseWidth: number   = currentAttachment.width;
        const baseHeight: number  = currentAttachment.height;
        const baseOffsetX: number = context._$offsetX;
        const baseOffsetY: number = context._$offsetY;

        // matrix to scale
        let xScale: number = $Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        let yScale: number = $Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        xScale /= $devicePixelRatio;
        yScale /= $devicePixelRatio;

        xScale *= 2;
        yScale *= 2;

        // pointer
        const radian: number = +(this._$angle * $Deg2Rad);
        const x: number = +($Math.cos(radian) * this._$distance * xScale);
        const y: number = +($Math.sin(radian) * this._$distance * yScale);

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

        const blurWidth: number   = highlightTextureBase.width;
        const blurHeight: number  = highlightTextureBase.height;
        const bevelWidth: number  = $Math.ceil(blurWidth  + $Math.abs(x) * 2);
        const bevelHeight: number = $Math.ceil(blurHeight + $Math.abs(y) * 2);

        // bevel filter buffer
        const isInner: boolean = this._$type === "inner";
        const width: number    = isInner ? baseWidth  : bevelWidth;
        const height: number   = isInner ? baseHeight : bevelHeight;

        const absX: number = $Math.abs(x);
        const absY: number = $Math.abs(y);
        const blurOffsetX: number = (blurWidth  - baseWidth)  / 2;
        const blurOffsetY: number = (blurHeight - baseHeight) / 2;

        const baseTextureX = isInner ? 0 : absX + blurOffsetX;
        const baseTextureY = isInner ? 0 : absY + blurOffsetY;
        const blurTextureX = isInner ? -blurOffsetX - x : absX - x;
        const blurTextureY = isInner ? -blurOffsetY - y : absY - y;

        context._$bind(currentAttachment);
        context._$applyBitmapFilter(
            highlightTextureBase, width, height,
            baseWidth, baseHeight, baseTextureX, baseTextureY,
            blurWidth, blurHeight, blurTextureX, blurTextureY,
            false, this._$type, this._$knockout,
            this._$strength, this._$ratios, this._$colors, this._$alphas,
            0, 0, 0, 0, 0, 0, 0, 0
        );

        context._$offsetX = baseOffsetX + baseTextureX;
        context._$offsetY = baseOffsetY + baseTextureY;

        manager.releaseAttachment(highlightTextureBaseAttachment, true);

        return manager.getTextureFromCurrentAttachment();
    }
}
