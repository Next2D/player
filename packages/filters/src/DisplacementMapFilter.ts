import type { IDisplacementMapFilterMode } from "./interface/IDisplacementMapFilterMode";
import type { IBitmapDataChannel } from "./interface/IBitmapDataChannel";
import { BitmapFilter } from "./BitmapFilter";
import { execute as displacementMapFilterCanApplyFilterService } from "./DisplacementMapFilter/service/DisplacementMapFilterCanApplyFilterService";
import { execute as displacementMapFilterToArrayService } from "./DisplacementMapFilter/service/DisplacementMapFilterToArrayService";
import { execute as displacementMapFilterToNumberArrayService } from "./DisplacementMapFilter/service/DisplacementMapFilterToNumberArrayService";
import {
    $clamp,
    $convertColorStringToNumber
} from "./FilterUtil";

/**
 * @description DisplacementMapFilter クラスは、指定された BitmapData オブジェクト（置き換えマップイメージと言います）
 *              のピクセル値を使用して、オブジェクトの置き換え（変位）を実行します。
 *
 *              The DisplacementMapFilter class uses the pixel values from the specified
 *              BitmapData object (called the displacement map image) to perform a displacement of an object.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class DisplacementMapFilter extends BitmapFilter
{
    /**
     * @description フィルター認識番号
     *              Filter Recognition Number
     *
     * @member {number}
     * @public
     */
    public $filterType: number = 4;

    /**
     * @type {Uint8Array}
     * @default null
     * @private
     */
    private _$bitmapBuffer: Uint8Array | null;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$bitmapWidth: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$bitmapHeight: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$mapPointX: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$mapPointY: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$componentX: IBitmapDataChannel;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$componentY: IBitmapDataChannel;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$scaleX: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$scaleY: number;

    /**
     * @type {string}
     * @default "wrap"
     * @private
     */
    private _$mode: IDisplacementMapFilterMode;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$color: number;

    /**
     * @type {number}
     * @default 0
     * @private
     */
    private _$alpha: number;

    /**
     * @param {Uint8Array} [bitmap_buffer = null]
     * @param {number} [bitmap_width = 0]
     * @param {number} [bitmap_height = 0]
     * @param {number} [map_point_x = 0]
     * @param {number} [map_point_y = 0]
     * @param {number} [component_x = 0]
     * @param {number} [component_y = 0]
     * @param {number} [scale_x = 0.0]
     * @param {number} [scale_y = 0.0]
     * @param {string} [mode = DisplacementMapFilterMode.WRAP]
     * @param {number} [color = 0]
     * @param {number} [alpha = 0.0]
     *
     * @constructor
     * @public
     */
    constructor (
        bitmap_buffer: Uint8Array | null = null,
        bitmap_width: number = 0,
        bitmap_height: number = 0,
        map_point_x: number = 0,
        map_point_y: number = 0,
        component_x: IBitmapDataChannel = 0,
        component_y: IBitmapDataChannel = 0,
        scale_x: number = 0,
        scale_y: number = 0,
        mode: IDisplacementMapFilterMode = "wrap",
        color: number = 0,
        alpha: number = 0
    ) {

        super();

        // default
        this._$bitmapBuffer = null;
        this._$bitmapWidth  = 0;
        this._$bitmapHeight = 0;
        this._$mapPointX    = 0;
        this._$mapPointY    = 0;
        this._$componentX   = 0;
        this._$componentY   = 0;
        this._$scaleX       = 0;
        this._$scaleY       = 0;
        this._$mode         = "wrap";
        this._$color        = 0;
        this._$alpha        = 0;

        // setup
        this.bitmapBuffer = bitmap_buffer;
        this.bitmapWidth  = bitmap_width;
        this.bitmapHeight = bitmap_height;
        this.mapPointX    = map_point_x;
        this.mapPointY    = map_point_y;
        this.componentX   = component_x;
        this.componentY   = component_y;
        this.scaleX       = scale_x;
        this.scaleY       = scale_y;
        this.mode         = mode;
        this.color        = color;
        this.alpha        = alpha;
    }

    /**
     * @description アルファ透明度の値です。
     *              The alpha transparency value for the color.
     *
     * @member  {number}
     * @default 0
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
     * @description 範囲外置き換えの場合に使用する色を指定します。
     *              Specifies what color to use for out-of-bounds displacements.
     *
     * @member  {number}
     * @default 0
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
     * @description x の結果を変位させる場合にどのカラーチャンネルをマップイメージで使用するかを指定します。
     *              Describes which color channel to use in the map image to displace the x result.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get componentX (): IBitmapDataChannel
    {
        return this._$componentX;
    }
    set componentX (component_x: IBitmapDataChannel)
    {
        if (component_x === this._$componentX) {
            return ;
        }
        this._$componentX = component_x;
        this.$updated = true;
    }

    /**
     * @description y の結果を変位させる場合にどのカラーチャンネルをマップイメージで使用するかを指定します。
     *              Describes which color channel to use in the map image to displace the y result.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get componentY (): IBitmapDataChannel
    {
        return this._$componentY;
    }
    set componentY (component_y: IBitmapDataChannel)
    {
        if (component_y === this._$componentY) {
            return ;
        }
        this._$componentY = component_y;
        this.$updated = true;
    }

    /**
     * @description 置き換えマップデータが含まれる BitmapData オブジェクトです。
     *              A BitmapData object containing the displacement map data.
     *
     * @member  {HTMLImageElement}
     * @default null
     * @public
     */
    get bitmapBuffer (): Uint8Array | null
    {
        return this._$bitmapBuffer;
    }
    set bitmapBuffer (bitmap_buffer: Uint8Array | null)
    {
        if (bitmap_buffer === this._$bitmapBuffer) {
            return ;
        }
        this._$bitmapBuffer = bitmap_buffer;
        this.$updated = true;
    }

    /**
     * @description 置き換えマップデータの幅です。
     *              The width of the displacement map image.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get bitmapWidth (): number
    {
        return this._$bitmapWidth;
    }
    set bitmapWidth (bitmap_width: number)
    {
        if (bitmap_width === this._$bitmapWidth) {
            return ;
        }
        this._$bitmapWidth = bitmap_width;
        this.$updated = true;
    }

    /**
     * @description 置き換えマップデータの高さです。
     *              The height of the displacement map image.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get bitmapHeight (): number
    {
        return this._$bitmapHeight;
    }
    set bitmapHeight (bitmap_height: number)
    {
        if (bitmap_height === this._$bitmapHeight) {
            return ;
        }
        this._$bitmapHeight = bitmap_height;
        this.$updated = true;
    }

    /**
     * @description マップイメージの左上隅を基準としたターゲット表示オブジェクトの
     *              左上隅のオフセットが含まれる値です。
     *              A value that contains the offset of the upper-left corner
     *              of the target display object from the upper-left corner of the map image.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get mapPointX (): number
    {
        return this._$mapPointX;
    }
    set mapPointX (map_point_x: number)
    {
        if (map_point_x === this._$mapPointX) {
            return ;
        }
        this._$mapPointX = map_point_x;
        this.$updated = true;
    }

    /**
     * @description マップイメージの左上隅を基準としたターゲット表示オブジェクトの
     *              左上隅のオフセットが含まれる値です。
     *              A value that contains the offset of the upper-left corner
     *              of the target display object from the upper-left corner of the map image.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get mapPointY (): number
    {
        return this._$mapPointY;
    }
    set mapPointY (map_point_y: number)
    {
        if (map_point_y === this._$mapPointY) {
            return ;
        }
        this._$mapPointY = map_point_y;
        this.$updated = true;
    }

    /**
     * @description フィルターのモードです。
     *              The mode for the filter.
     *
     * @member  {string}
     * @default DisplacementMapFilterMode.WRAP
     * @public
     */
    get mode (): IDisplacementMapFilterMode
    {
        return this._$mode;
    }
    set mode (mode: IDisplacementMapFilterMode)
    {
        if (mode === this._$mode) {
            return ;
        }
        this._$mode   = mode;
        this.$updated = true;
    }

    /**
     * @description マップ計算の x 置き換え結果を拡大 / 縮小する場合に使用する乗数です。
     *              The multiplier to use to scale the x displacement result from the map calculation.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get scaleX (): number
    {
        return this._$scaleX;
    }
    set scaleX (scale_x: number)
    {
        scale_x = $clamp(+scale_x, -0xffff, 0xffff, 0);
        if (scale_x === this._$scaleX) {
            return ;
        }
        this._$scaleX = scale_x;
        this.$updated = true;
    }

    /**
     * @description マップ計算の y 置き換え結果を拡大 / 縮小する場合に使用する乗数です。
     *              The multiplier to use to scale the y displacement result from the map calculation.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get scaleY (): number
    {
        return this._$scaleY;
    }
    set scaleY (scale_y: number)
    {
        scale_y = $clamp(+scale_y, -0xffff, 0xffff, 0);
        if (scale_y === this._$scaleY) {
            return ;
        }
        this._$scaleY = scale_y;
        this.$updated = true;
    }

    /**
     * @description オブジェクトのコピーを返します。
     *              Returns a copy of this filter object.
     *
     * @return {DisplacementMapFilter}
     * @method
     * @public
     */
    clone (): DisplacementMapFilter
    {
        return new DisplacementMapFilter(
            this._$bitmapBuffer?.slice(),
            this._$bitmapWidth, this._$bitmapHeight, 
            this._$mapPointX, this._$mapPointX, 
            this._$componentX, this._$componentY,
            this._$scaleX, this._$scaleY, 
            this._$mode, this._$color, this._$alpha
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
    toArray (): Array<number | string | number[] | null>
    {
        return displacementMapFilterToArrayService(this);
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
        return displacementMapFilterToNumberArrayService(this);
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
        return displacementMapFilterCanApplyFilterService(this);
    }
}