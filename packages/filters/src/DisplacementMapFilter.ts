import { BitmapFilter } from "./BitmapFilter";
import type {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import type { AttachmentImpl } from "./interface/AttachmentImpl";
import type { DisplacementMapFilterModeImpl } from "./interface/DisplacementMapFilterModeImpl";
import type { BitmapDataChannelImpl } from "./interface/BitmapDataChannelImpl";
import type { BoundsImpl } from "./interface/BoundsImpl";
import type { PointImpl } from "@next2d/interface";
import {
    $clamp,
    $getArray,
    $intToB,
    $intToG,
    $intToR,
    $Math,
    $toColorInt
} from "@next2d/share";

/**
 * DisplacementMapFilter クラスは、指定された BitmapData オブジェクト（置き換えマップイメージと言います）
 * のピクセル値を使用して、オブジェクトの置き換え（変位）を実行します。
 *
 * The DisplacementMapFilter class uses the pixel values from the specified
 * BitmapData object (called the displacement map image) to perform a displacement of an object.
 *
 * @class
 * @memberOf next2d.filters
 * @extends  BitmapFilter
 */
export class DisplacementMapFilter extends BitmapFilter
{
    private _$mapBitmap: HTMLImageElement | null;
    private _$mapPoint: PointImpl | null;
    private _$componentX: BitmapDataChannelImpl;
    private _$componentY: BitmapDataChannelImpl;
    private _$scaleX: number;
    private _$scaleY: number;
    private _$mode: DisplacementMapFilterModeImpl;
    private _$color: number;
    private _$alpha: number;

    /**
     * @param {HTMLImageElement} [map_bitmap = null]
     * @param {object} [map_point = null]
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
        map_bitmap: HTMLImageElement | null = null,
        map_point: PointImpl | null = null,
        component_x: BitmapDataChannelImpl = 0,
        component_y: BitmapDataChannelImpl = 0,
        scale_x: number = 0, scale_y: number = 0,
        mode: DisplacementMapFilterModeImpl = "wrap",
        color: number = 0, alpha: number = 0
    ) {

        super();

        /**
         * @type {BitmapData}
         * @default null
         * @private
         */
        this._$mapBitmap = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$mapPoint = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$componentX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$componentY = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scaleX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scaleY = 0;

        /**
         * @type {string}
         * @default DisplacementMapFilterMode.WRAP
         * @private
         */
        this._$mode = "wrap";

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$color = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$alpha = 0;

        // setup
        this.mapBitmap  = map_bitmap;
        this.mapPoint   = map_point;
        this.componentX = component_x;
        this.componentY = component_y;
        this.scaleX     = scale_x;
        this.scaleY     = scale_y;
        this.mode       = mode;
        this.color      = color;
        this.alpha      = alpha;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class DisplacementMapFilter]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class DisplacementMapFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.DisplacementMapFilter
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.filters.DisplacementMapFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object DisplacementMapFilter]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object DisplacementMapFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.DisplacementMapFilter
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.filters.DisplacementMapFilter";
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
        if (alpha !== this._$alpha) {
            this._$alpha = alpha;
            this._$doChanged();
        }
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
            $toColorInt(color),0 ,0xffffff, 0
        );

        if (color !== this._$color) {
            this._$color = color;
            this._$doChanged();
        }
    }

    /**
     * @description x の結果を変位させる場合にどのカラーチャンネルをマップイメージで使用するかを指定します。
     *              Describes which color channel to use in the map image to displace the x result.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get componentX (): BitmapDataChannelImpl
    {
        return this._$componentX;
    }
    set componentX (component_x: BitmapDataChannelImpl)
    {
        if (component_x !== this._$componentX) {
            this._$componentX = component_x;
            this._$doChanged();
        }
    }

    /**
     * @description y の結果を変位させる場合にどのカラーチャンネルをマップイメージで使用するかを指定します。
     *              Describes which color channel to use in the map image to displace the y result.
     *
     * @member  {number}
     * @default 0
     * @public
     */
    get componentY (): BitmapDataChannelImpl
    {
        return this._$componentY;
    }
    set componentY (component_y: BitmapDataChannelImpl)
    {
        if (component_y !== this._$componentY) {
            this._$componentY = component_y;
            this._$doChanged();
        }
    }

    /**
     * @description 置き換えマップデータが含まれる BitmapData オブジェクトです。
     *              A BitmapData object containing the displacement map data.
     *
     * @member  {HTMLImageElement}
     * @default null
     * @public
     */
    get mapBitmap (): HTMLImageElement | null
    {
        return this._$mapBitmap;
    }
    set mapBitmap (map_bitmap: HTMLImageElement | null)
    {
        if (map_bitmap !== this._$mapBitmap) {
            this._$mapBitmap = map_bitmap;
            this._$doChanged();
        }
    }

    /**
     * @description マップイメージの左上隅を基準としたターゲット表示オブジェクトの
     *              左上隅のオフセットが含まれる値です。
     *              A value that contains the offset of the upper-left corner
     *              of the target display object from the upper-left corner of the map image.
     *
     * @member  {object}
     * @default null
     * @public
     */
    get mapPoint (): PointImpl | null
    {
        return this._$mapPoint;
    }
    set mapPoint (map_point: PointImpl | null)
    {
        if (map_point !== this._$mapPoint) {
            this._$mapPoint = map_point;
            this._$doChanged();
        }
    }

    /**
     * @description フィルターのモードです。
     *              The mode for the filter.
     *
     * @member  {string}
     * @default DisplacementMapFilterMode.WRAP
     * @public
     */
    get mode (): DisplacementMapFilterModeImpl
    {
        return this._$mode;
    }
    set mode (mode: DisplacementMapFilterModeImpl)
    {
        if (mode !== this._$mode) {
            this._$mode = mode;
            this._$doChanged();
        }
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
        if (scale_x !== this._$scaleX) {
            this._$scaleX = scale_x;
            this._$doChanged();
        }
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
        if (scale_y !== this._$scaleY) {
            this._$scaleY = scale_y;
            this._$doChanged();
        }
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
            this._$mapBitmap, this._$mapPoint, this._$componentX, this._$componentY,
            this._$scaleX, this._$scaleY, this._$mode, this._$color, this._$alpha
        );
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    _$toArray (): any[]
    {
        return $getArray(4,
            this._$mapBitmap, this._$mapPoint, this._$componentX, this._$componentY,
            this._$scaleX, this._$scaleY, this._$mode, this._$color, this._$alpha
        );
    }

    /**
     * @param  {object} bounds
     * @return {object}
     * @method
     * @private
     */
    _$generateFilterRect (bounds: BoundsImpl): BoundsImpl
    {
        return bounds;
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$canApply (): boolean
    {
        return this._$mapBitmap !== null
            && this._$componentX > 0 && this._$componentY > 0
            && this._$scaleX !== 0 && this._$scaleY !== 0;
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

        const texture: WebGLTexture = manager
            .getTextureFromCurrentAttachment();

        if (!this._$canApply()
            || !currentAttachment
            || !this._$mapBitmap
        ) {
            return texture;
        }

        // matrix to scale
        const xScale: number = $Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale: number = $Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        context._$applyDisplacementMapFilter(
            texture,
            this._$mapBitmap,
            texture.width  / xScale,
            texture.height / yScale,
            this._$mapPoint,
            this._$componentX,
            this._$componentY,
            this._$scaleX,
            this._$scaleY,
            this._$mode,
            $intToR(this._$color, this._$alpha, true),
            $intToG(this._$color, this._$alpha, true),
            $intToB(this._$color, this._$alpha, true),
            this._$alpha
        );

        manager.releaseAttachment(currentAttachment, true);

        return manager.getTextureFromCurrentAttachment();
    }
}
