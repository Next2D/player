import type { IFilterQuality } from "./interface/IFilterQuality";
import { BitmapFilter } from "./BitmapFilter";
import { execute as glowFilterToArrayService } from "./GlowFilter/service/GlowFilterToArrayService";
import { execute as glowFilterToNumberArrayService } from "./GlowFilter/service/GlowFilterToNumberArrayService";
import { execute as glowFilterCanApplyFilterService } from "./GlowFilter/service/GlowFilterCanApplyFilterService";
import { execute as glowFilterGetBoundsUseCase } from "./GlowFilter/usecase/GlowFilterGetBoundsUseCase";
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
     * @description フィルター認識番号
     *              Filter Recognition Number
     *
     * @member {number}
     * @public
     */
    public readonly $filterType: number = 6;

    /**
     * @type {number}
     * @default 4
     * @private
     */
    private _$blurX: number;

    /**
     * @type {number}
     * @default 4
     * @private
     */
    private _$blurY: number;

    /**
     * @type {IFilterQuality}
     * @default 1
     * @private
     */
    private _$quality: IFilterQuality;

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
        this._$blurX      = 4;
        this._$blurY      = 4;
        this._$quality    = 1;
        this._$color      = 0;
        this._$alpha      = 1;
        this._$strength   = 1;
        this._$inner      = false;
        this._$knockout   = false;

        // setup
        this.blurX    = blur_x;
        this.blurY    = blur_y;
        this.quality  = quality;
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
        return this._$blurX;
    }
    set blurX (blur_x: number)
    {
        blur_x = $clamp(+blur_x, 0, 255, 0);
        if (blur_x === this._$blurX) {
            return ;
        }
        this._$blurX  = blur_x;
        this.$updated = true;
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
        if (blur_y === this._$blurY) {
            return ;
        }
        this._$blurY  = blur_y;
        this.$updated = true;
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
        return this._$quality;
    }
    set quality (quality: IFilterQuality)
    {
        quality = $clamp(quality | 0, 0, 15, 1) as IFilterQuality;
        if (quality === this._$quality) {
            return ;
        }
        this._$quality = quality;
        this.$updated  = true;
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
            this._$color, this._$alpha, this._$blurX, this._$blurY,
            this._$strength, this._$quality, this._$inner, this._$knockout
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
        return glowFilterToArrayService(this);
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
        return glowFilterToNumberArrayService(this);
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
        return glowFilterCanApplyFilterService(this);
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
        return glowFilterGetBoundsUseCase(this, bounds);
    }
}