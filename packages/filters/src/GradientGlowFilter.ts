import type { IFilterQuality } from "./interface/IFilterQuality";
import type { IBitmapFilterType } from "./interface/IBitmapFilterType";
import type { IBounds } from "./interface/IBounds";
import { BitmapFilter } from "./BitmapFilter";
import { BlurFilter } from "./BlurFilter";
import {
    $clamp,
    $convertColorStringToNumber,
    $Deg2Rad
} from "./FilterUtil";

/**
 * @description GradientGlowFilter クラスを使用すると、表示オブジェクトにグラデーショングロー効果を適用できます。
 *              グラデーショングローとは、制御可能なカラーグラデーションによるリアルな輝きです。
 *              グラデーショングローは、オブジェクトの内側エッジや外側エッジの周囲、またはオブジェクトの上に適用できます。
 *
 *              The GradientGlowFilter class lets you apply a gradient glow effect to display objects.
 *              A gradient glow is a realistic-looking glow with a color gradient that you can control.
 *              You can apply a gradient glow around the inner or outer edge of an object or on top of an object.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class GradientGlowFilter extends BitmapFilter
{
    /**
     * @type {BlurFilter}
     * @private
     */
    private _$blurFilter: BlurFilter;

    /**
     * @type {number}
     * @default 4
     * @private
     */
    private _$distance: number;

    /**
     * @type {number}
     * @default 45
     * @private
     */
    private _$angle: number;

    /**
     * @type {array}
     * @default null
     * @private
     */
    private _$colors: number[] | null;

    /**
     * @type {array}
     * @default null
     * @private
     */
    private _$alphas: number[] | null;

    /**
     * @type {array}
     * @default null
     * @private
     */
    private _$ratios: number[] | null;

    /**
     * @type {number}
     * @default 1
     * @private
     */
    private _$strength: number;

    /**
     * @type {string}
     * @default "inner"
     * @private
     */
    private _$type: IBitmapFilterType;

    /**
     * @type {boolean}
     * @default false
     * @private
     */
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
        distance: number = 4,
        angle: number = 45,
        colors: number[] | null = null,
        alphas: number[] | null = null,
        ratios: number[] | null = null,
        blur_x: number = 4,
        blur_y: number = 4,
        strength: number = 1,
        quality: IFilterQuality = 1,
        type: IBitmapFilterType = "inner",
        knockout: boolean = false
    ) {

        super();

        // default
        this._$blurFilter = new BlurFilter(blur_x, blur_y, quality);
        this._$distance   = 4;
        this._$angle      = 45;
        this._$colors     = null;
        this._$alphas     = null;
        this._$ratios     = null;
        this._$strength   = 1;
        this._$type       = "inner";
        this._$knockout   = false;

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
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return {string}
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.filters.GradientGlowFilter";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return {string}
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
        if (alphas === this._$alphas) {
            return ;
        }
        if (Array.isArray(alphas)) {
            for (let idx = 0; idx < alphas.length; ++idx) {
                const alpha = alphas[idx];
                alphas[idx] = $clamp(+alpha, 0, 1, 0);
            }
        }
        this._$alphas = alphas;
        this.$updated = true;
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
        if (angle === this._$angle) {
            return ;
        }
        this._$angle  = angle;
        this.$updated = true;
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
        this.$updated = this._$blurFilter.$updated;
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
        this.$updated = this._$blurFilter.$updated;
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
        if (this._$colors === colors) {
            return ;
        }
        if (Array.isArray(colors)) {
            for (let idx = 0; idx < colors.length; ++idx) {
                const color = colors[idx];
                colors[idx] = $clamp(
                    typeof color === "string" 
                        ? $convertColorStringToNumber(color) 
                        : color
                    , 0, 0xffffff, 0
                );
            }
        }
        this._$colors = colors;
        this.$updated = true;
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
        if (distance === this._$distance) {
            return ;
        }
        this._$distance = distance;
        this.$updated   = true;
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
        knockout = !!knockout;
        if (knockout === this._$knockout) {
            return ;
        }
        this._$knockout = knockout;
        this.$updated   = true;
    }

    /**
     * @description ぼかしの実行回数です。
     *              The number of times to perform the blur.
     *
     * @member  {number}
     * @default 1
     * @public
     */
    get quality (): IFilterQuality
    {
        return this._$blurFilter.quality;
    }
    set quality (quality: IFilterQuality)
    {
        this._$blurFilter.quality = quality;
        this.$updated = this._$blurFilter.$updated;
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
        if (this._$ratios === ratios) {
            return ;
        }
        if (Array.isArray(ratios)) {
            for (let idx = 0; idx < ratios.length; ++idx) {
                ratios[idx] = $clamp(+ratios[idx], 0, 255, 0);
            }
        }
        this._$ratios = ratios;
        this.$updated = true;
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
        if (strength === this._$strength) {
            return ;
        }
        this._$strength = strength;
        this.$updated   = true;
    }

    /**
     * @description オブジェクトでのベベルの配置
     *              The placement of the bevel on the object.
     *
     * @member  {string}
     * @default BitmapFilterType.INNER
     * @public
     */
    get type (): IBitmapFilterType
    {
        return this._$type;
    }
    set type (type: IBitmapFilterType)
    {
        if (type === this._$type) {
            return ;
        }
        this._$type   = type;
        this.$updated = true;
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
     * @description 設定されたフィルターの値を配列で返します。
     *              Returns the value of the specified filter as an array.
     *
     * @return {array}
     * @method
     * @public
     */
    toArray (): Array<number | boolean | number[] | null | boolean | string>
    {
        return [8,
            this._$distance, this._$angle, this._$colors, this._$alphas, this._$ratios,
            this._$blurFilter.blurX, this._$blurFilter.blurY, this._$strength,
            this._$blurFilter.quality, this._$type, this._$knockout
        ];
    }

    /**
     * @description フィルターを適用できるかどうかを返します。
     *              Returns whether the filter can be applied.
     *
     * @return {boolean}
     * @method
     * @public
     */
    canApplyFilter (): boolean
    {
        return this._$strength > 0 && this._$distance > 0
            && this._$alphas !== null && this._$ratios !== null && this._$colors !== null
            && this._$blurFilter.canApplyFilter();
    }

    /**
     * @description フィルターの描画範囲のバウンディングボックスを返します。
     *              Returns the bounding box of the filter drawing area.
     * 
     * @param  {object} bounds
     * @return {object}
     * @method
     * @public
     */
    getBounds (bounds: IBounds): IBounds
    {
        if (!this.canApplyFilter()) {
            return bounds;
        }

        this._$blurFilter.getBounds(bounds);
        if (this._$type === "inner") {
            return bounds;
        }
        
        const radian: number = this._$angle * $Deg2Rad;
        const x: number = Math.abs(Math.cos(radian) * this._$distance);
        const y: number = Math.abs(Math.sin(radian) * this._$distance);

        bounds.xMin = Math.min(bounds.xMin, x);
        if (x > 0) {
            bounds.xMax += x;
        }
        bounds.yMin = Math.min(bounds.yMin, y);
        if (y > 0) {
            bounds.yMax += y;
        }

        return bounds;
    }
}