import type { IFilterQuality } from "./interface/IFilterQuality";
import { BitmapFilter } from "./BitmapFilter";
import { execute as dropShadowFilterToArrayService } from "./DropShadowFilter/service/DropShadowFilterToArrayService";
import { execute as dropShadowFilterToNumberArrayService } from "./DropShadowFilter/service/DropShadowFilterToNumberArrayService";
import { execute as dropShadowFilterCanApplyFilterService } from "./DropShadowFilter/service/DropShadowFilterCanApplyFilterService";
import { execute as dropShadowFilterGetBoundsUseCase } from "./DropShadowFilter/usecase/DropShadowFilterGetBoundsUseCase";
import {
    $clamp,
    $convertColorStringToNumber
} from "./FilterUtil";

/**
 * @description DropShadowFilter クラスは、ドロップシャドウを表示オブジェクトに追加します。
 *              シャドウアルゴリズムは、ぼかしフィルターで使用するのと同じボックスフィルターに基づいています。
 *              ドロップシャドウのスタイルには複数のオプションがあり、内側シャドウ、外側シャドウ、ノックアウトモードなどがあります。
 *
 *              The DropShadowFilter class lets you add a drop shadow to display objects.
 *              The shadow algorithm is based on the same box filter that the blur filter uses.
 *              You have several options for the style of the drop shadow, including inner
 *              or outer shadow and knockout mode.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class DropShadowFilter extends BitmapFilter
{
    /**
     * @description フィルター認識番号
     *              Filter Recognition Number
     *
     * @member {number}
     * @public
     */
    public readonly $filterType: number = 5;

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
     * @type {boolean}
     * @default false
     * @private
     */
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
        distance: number = 4,
        angle: number = 45,
        color: number = 0,
        alpha: number = 1,
        blur_x: number = 4,
        blur_y: number = 4,
        strength: number = 1,
        quality: IFilterQuality = 1,
        inner: boolean = false,
        knockout: boolean = false,
        hide_object: boolean = false
    ) {

        super();

        // default
        this._$blurX      = 4;
        this._$blurY      = 4;
        this._$quality    = 1;
        this._$distance   = 4;
        this._$angle      = 45;
        this._$color      = 0;
        this._$alpha      = 1;
        this._$strength   = 1;
        this._$inner      = false;
        this._$knockout   = false;
        this._$hideObject = false;

        // setup
        this.blurX      = blur_x;
        this.blurY      = blur_y;
        this.quality    = quality;
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
            , 0, 0xffffff, 0
        );

        if (color === this._$color) {
            return ;
        }
        this._$color  = color;
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
        hide_object = !!hide_object;
        if (hide_object === this._$hideObject) {
            return ;
        }
        this._$hideObject = hide_object;
        this.$updated     = true;
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
     * @return {DropShadowFilter}
     * @method
     * @public
     */
    clone (): DropShadowFilter
    {
        return new DropShadowFilter(
            this._$distance, this._$angle, this._$color, this._$alpha,
            this._$blurX, this._$blurY, this._$strength,
            this._$quality, this._$inner, this._$knockout, this._$hideObject
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
        return dropShadowFilterToArrayService(this);
    }

    /**
     * @description 設定されたフィルターの値を数値配列で返します。
     *              Returns the value of the specified filter as a number array.
     *
     * @return {Float32Array}
     * @method
     * @public
     */
    toNumberArray (): Float32Array
    {
        return dropShadowFilterToNumberArrayService(this);
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
        return dropShadowFilterCanApplyFilterService(this);
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
        return dropShadowFilterGetBoundsUseCase(this, bounds);
    }
}