import type { IFilterQuality } from "./interface/IFilterQuality";
import { BitmapFilter } from "./BitmapFilter";
import { BlurFilter } from "./BlurFilter";
import {
    $clamp,
    $convertColorStringToNumber
} from "./FilterUtil";

/**
 * @description GlowFilter クラスを使用すると、表示オブジェクトにグロー効果を適用できます。
 *              グローのスタイルには複数のオプションがあり、内側グロー、外側グロー、ノックアウトモードなどがあります。
 *              グローフィルターは、distance プロパティと angle プロパティを 0 に設定したドロップシャドウフィルターによく似ています。
 *
 *              The GlowFilter class lets you apply a glow effect to display objects.
 *              You have several options for the style of the glow, including inner or outer glow and knockout mode.
 *              The glow filter is similar to the drop shadow filter with the distance
 *              and angle properties of the drop shadow filter set to 0.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class GlowFilter extends BitmapFilter
{
    /**
     * @type {BlurFilter}
     * @private
     */
    private readonly _$blurFilter: BlurFilter;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$color: number;

    /**
     * @type {number}
     * @default 1
     * @private
     */
    private _$alpha: number;

    /**
     * @type {number}
     * @default 1
     * @private
     */
    private _$strength: number;

    /**
     * @type {boolean}
     * @default false
     * @private
     */
    private _$inner: boolean;

    /**
     * @type {boolean}
     * @default false
     * @private
     */
    private _$knockout: boolean;

    /**
     * @param   {number}  [color=0xFF0000]
     * @param   {number}  [alpha=1]
     * @param   {number}  [blur_x=6]
     * @param   {number}  [blur_y=6]
     * @param   {number}  [strength=2]
     * @param   {number}  [quality=1]
     * @param   {boolean} [inner=false]
     * @param   {boolean} [knockout=false]
     *
     * @constructor
     * @public
     */
    constructor (
        color: number = 0,
        alpha: number = 1,
        blur_x: number = 4,
        blur_y: number = 4,
        strength: number = 1,
        quality: IFilterQuality = 1,
        inner: boolean = false,
        knockout: boolean = false
    ) {

        super();

        // default
        this._$blurFilter = new BlurFilter(blur_x, blur_y, quality);
        this._$color      = 0;
        this._$alpha      = 1;
        this._$strength   = 1;
        this._$inner      = false;
        this._$knockout   = false;

        // setup
        this.color    = color;
        this.alpha    = alpha;
        this.strength = strength;
        this.inner    = inner;
        this.knockout = knockout;
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
        if (alpha === this._$alpha) {
            return ;
        }
        this._$alpha  = alpha;
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
            typeof color === "string"
                ? $convertColorStringToNumber(color)
                : color
            , 0, 0xffffff, 4
        );
        if (color === this._$color) {
            return ;
        }
        this._$color  = color;
        this.$updated = true;
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
        inner = !!inner;
        if (inner === this._$inner) {
            return ;
        }
        this._$inner  = inner;
        this.$updated = true;
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
     * @description 設定されたフィルターの値を配列で返します。
     *              Returns the value of the specified filter as an array.
     *
     * @return {array}
     * @method
     * @public
     */
    toArray (): Array<number | boolean>
    {
        return [6,
            this._$color, this._$alpha, this._$blurFilter.blurX, this._$blurFilter.blurY,
            this._$strength, this._$blurFilter.quality, this._$inner, this._$knockout
        ];
    }

    /**
     * @description 設定されたフィルターの値を数値配列で返します。
     *              Returns the value of the specified filter as a number array.
     *
     * @return {number[]}
     * @method
     * @public
     */
    toNumberArray (): number[]
    {
        return [6,
            this._$color, this._$alpha, this._$blurFilter.blurX, this._$blurFilter.blurY,
            this._$strength, this._$blurFilter.quality, +this._$inner, +this._$knockout
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
        return this._$alpha > 0
            && this._$strength > 0
            && this._$blurFilter.canApplyFilter();
    }

    /**
     * @description フィルターの描画範囲のバウンディングボックスを返します。
     *              Returns the bounding box of the filter drawing area.
     *
     * @param  {Float32Array} bounds
     * @return {Float32Array}
     * @method
     * @public
     */
    getBounds (bounds: Float32Array): Float32Array
    {
        if (!this.canApplyFilter() || this._$inner) {
            return bounds;
        }

        return this._$blurFilter.getBounds(bounds);
    }
}