import type { IBitmapFilterType } from "./interface/IBitmapFilterType";
import type { IFilterQuality } from "./interface/IFilterQuality";
import { BitmapFilter } from "./BitmapFilter";
import { execute as bevelFilterGetBoundsService } from "./BevelFilter/usecase/BevelFilterGetBoundsUseCase";
import { execute as bevelFilterCanApplyFilterService } from "./BevelFilter/service/BevelFilterCanApplyFilterService";
import { execute as bevelFilterToArrayService } from "./BevelFilter/service/BevelFilterToArrayService";
import { execute as bevelFilterToNumberArrayService } from "./BevelFilter/service/BevelFilterToNumberArrayService";
import {
    $clamp,
    $convertColorStringToNumber
} from "./FilterUtil";

/**
 * @description BevelFilter クラスを使用すると、表示オブジェクトにベベル効果を追加できます。
 *              ボタンなどのオブジェクトにベベル効果を適用すると 3 次元的に表現されます。
 *              異なるハイライトカラー、シャドウカラー、ベベルのぼかし量、ベベルの角度、ベベルの配置、
 *              ノックアウト効果を使用して、ベベルの外観をカスタマイズできます。
 *
 *              The BevelFilter class lets you add a bevel effect to display objects.
 *              A bevel effect gives objects such as buttons a three-dimensional look.
 *              You can customize the look of the bevel with different highlight and shadow colors,
 *              the amount of blur on the bevel, the angle of the bevel, the placement of the bevel,
 *              and a knockout effect.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class BevelFilter extends BitmapFilter
{
    /**
     * @description フィルター認識番号
     *              Filter Recognition Number
     *
     * @member {number}
     * @public
     */
    public readonly $filterType: number = 0;

    /**
     * @description BevelFilterの認識番号
     *              The recognition number of the BevelFilter.
     *
     * @member {number}
     * @public
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
     * @default 0xffffff
     * @private
     */
    private _$highlightColor: number;

    /**
     * @type {number}
     * @default 1
     * @private
     */
    private _$highlightAlpha: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$shadowColor: number;

    /**
     * @type {number}
     * @default 1
     * @private
     */
    private _$shadowAlpha: number;

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
     * @param {number}  [distance=4]
     * @param {number}  [angle=45]
     * @param {number}  [highlight_color=0xffffff]
     * @param {number}  [highlight_alpha=1]
     * @param {number}  [shadow_color=0x000000]
     * @param {number}  [shadow_alpha=1]
     * @param {number}  [blur_x=4]
     * @param {number}  [blur_y=4]
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
        highlight_color: number = 0xffffff,
        highlight_alpha: number = 1,
        shadow_color: number = 0,
        shadow_alpha: number = 1,
        blur_x: number = 4,
        blur_y: number = 4,
        strength: number = 1,
        quality: IFilterQuality = 1,
        type: IBitmapFilterType = "inner",
        knockout: boolean = false
    ) {

        super();

        // default
        this._$distance       = 4;
        this._$angle          = 45;
        this._$highlightColor = 0xffffff;
        this._$highlightAlpha = 1;
        this._$blurX          = 4;
        this._$blurY          = 4;
        this._$quality        = 1;
        this._$shadowColor    = 0;
        this._$shadowAlpha    = 1;
        this._$strength       = 1;
        this._$type           = "inner";
        this._$knockout       = false;

        // setup
        this.blurX          = blur_x;
        this.blurY          = blur_y;
        this.quality        = quality;
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
        if (highlight_alpha === this._$highlightAlpha) {
            return ;
        }
        this._$highlightAlpha = highlight_alpha;
        this.$updated = true;
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
    set highlightColor (highlight_color: number | string)
    {
        highlight_color = $clamp(
            typeof highlight_color === "string"
                ? $convertColorStringToNumber(highlight_color)
                : highlight_color
            , 0, 0xffffff, 0xffffff
        );
        if (highlight_color === this._$highlightColor) {
            return ;
        }
        this._$highlightColor = highlight_color;
        this.$updated = true;
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
        shadow_alpha = $clamp(shadow_alpha, 0, 1, 0);
        if (shadow_alpha === this._$shadowAlpha) {
            return ;
        }
        this._$shadowAlpha = shadow_alpha;
        this.$updated = true;
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
    set shadowColor (shadow_color: number | string)
    {
        shadow_color = $clamp(
            typeof shadow_color === "string"
                ? $convertColorStringToNumber(shadow_color)
                : shadow_color
            , 0, 0xffffff, 0
        );

        if (shadow_color === this._$shadowColor) {
            return ;
        }
        this._$shadowColor = shadow_color;
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
        type = `${type}`.toLowerCase() as IBitmapFilterType;
        if (type === this._$type) {
            return ;
        }

        switch (type) {

            case "inner":
            case "outer":
            case "full":
                break;

            default:
                return ;
        }

        this._$type   = type;
        this.$updated = true;
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
            this._$shadowColor, this._$shadowAlpha, this._$blurX, this._$blurY,
            this._$strength, this._$quality, this._$type, this._$knockout
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
    toArray (): Array<number | string | boolean>
    {
        return bevelFilterToArrayService(this);
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
        return bevelFilterToNumberArrayService(this);
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
        return bevelFilterCanApplyFilterService(this);
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
        return bevelFilterGetBoundsService(this, bounds);
    }
}