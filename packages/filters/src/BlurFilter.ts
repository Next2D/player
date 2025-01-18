import type { IFilterQuality } from "./interface/IFilterQuality";
import { BitmapFilter } from "./BitmapFilter";
import { $clamp } from "./FilterUtil";
import { execute as blurFilterToArrayService } from "./BlurFilter/service/BlurFilterToArrayService";
import { execute as blurFilterGetBoundsUseCase } from "./BlurFilter/usecase/BlurFilterGetBoundsUseCase";
import { execute as blurFilterCanApplyFilterService } from "./BlurFilter/service/BlurFilterCanApplyFilterService";

/**
 * @description BlurFilter クラスを使用すると、表示オブジェクトにぼかし効果を適用できます。
 *              ぼかし効果は、イメージの細部をぼかします。ソフトフォーカスがかかっているように見えるぼかしから、
 *              半透明ガラスを通してイメージを見るようにかすんで見えるガウスぼかしまで作成できます。
 *              このフィルターの quality プロパティを低く設定すると、ソフトフォーカスがかかっているように見えるぼかしになります。
 *              quality プロパティを高く設定すると、ガウスぼかしフィルターに似たものになります。
 *
 *              The BlurFilter class lets you apply a blur visual effect to display objects.
 *              A blur effect softens the details of an image.
 *              You can produce blurs that range from a softly unfocused look to a Gaussian blur,
 *              a hazy appearance like viewing an image through semi-opaque glass.
 *              When the quality property of this filter is set to low, the result is a softly unfocused look.
 *              When the quality property is set to high, it approximates a Gaussian blur filter.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class BlurFilter extends BitmapFilter
{
    /**
     * @description BlurFilterの認識番号
     *              The recognition number of the BlurFilter.
     *
     * @member {number}
     * @public
     */
    public readonly $filterType: number = 1;

    /**
     * @description 水平方向のぼかし量。
     *              The amount of horizontal blur.
     *
     * @member  {number}
     * @default 4
     * @private
     */
    private _$blurX: number;

    /**
     * @description 垂直方向のぼかし量。
     *              The amount of vertical blur.
     *
     * @member  {number}
     * @default 4
     * @private
     */
    private _$blurY: number;

    /**
     * @description ぼかしの実行回数です。
     *              The number of times to perform the blur.
     *
     * @member  {number}
     * @default 1
     * @private
     */
    private _$quality: IFilterQuality;

    /**
     * @param {number} [blur_x=4]
     * @param {number} [blur_y=4]
     * @param {number} [quality=1]
     *
     * @constructor
     * @public
     */
    constructor (blur_x: number = 4, blur_y: number = 4, quality: IFilterQuality = 1)
    {
        super();

        // default
        this._$blurX   = 4;
        this._$blurY   = 4;
        this._$quality = 1;

        // setup
        this.blurX   = blur_x;
        this.blurY   = blur_y;
        this.quality = quality;
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
     * @description オブジェクトのコピーを返します。
     *              Returns a copy of this filter object.
     *
     * @return {BlurFilter}
     * @method
     * @public
     */
    clone (): BlurFilter
    {
        return new BlurFilter(this._$blurX, this._$blurY, this._$quality);
    }

    /**
     * @description 設定されたフィルターの値を配列で返します。
     *              Returns the value of the specified filter as an array.
     *
     * @return {array}
     * @method
     * @public
     */
    toArray (): number[]
    {
        return blurFilterToArrayService(this);
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
        return blurFilterToArrayService(this);
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
        return blurFilterCanApplyFilterService(this);
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
        return blurFilterGetBoundsUseCase(this, bounds);
    }
}