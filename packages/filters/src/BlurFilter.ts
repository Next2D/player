import type { IFilterQuality } from "./interface/IFilterQuality";
import { BitmapFilter } from "./BitmapFilter";
import { $clamp } from "./FilterUtil";

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
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return {string}
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.filters.BlurFilter";
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
        return "next2d.filters.BlurFilter";
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
        return [1,
            this._$blurX, this._$blurY, this._$quality
        ];
    }
}