import { $doUpdated } from "@next2d/share";

/**
 * BitmapFilter クラスは、すべてのイメージフィルター効果の基本クラスです。
 * BevelFilter、BlurFilter、ColorMatrixFilter、ConvolutionFilter、DisplacementMapFilter、DropShadowFilter、GlowFilter、GradientBevelFilter、
 * および GradientGlowFilter クラスはすべて、BitmapFilter クラスを継承します。
 * このフィルター効果は、あらゆる表示オブジェクトに適用できます。
 *
 * The BitmapFilter class is the base class for all image filter effects.
 * The BevelFilter, BlurFilter, ColorMatrixFilter, ConvolutionFilter, DisplacementMapFilter, DropShadowFilter, GlowFilter, GradientBevelFilter,
 * and GradientGlowFilter classes all extend the BitmapFilter class.
 * You can apply these filter effects to any display object.
 * You can neither directly instantiate nor extend BitmapFilter.
 *
 * @class
 * @memberOf next2d.filters
 */
export class BitmapFilter
{
    protected _$updated: boolean;

    /**
     * @constructor
     * @public
     */
    constructor()
    {
        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$updated = true;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class BitmapFilter]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class BitmapFilter]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.filters.BitmapFilter
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.filters.BitmapFilter";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BitmapFilter]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object BitmapFilter]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.filters.BitmapFilter
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.filters.BitmapFilter";
    }

    /**
     * @return {boolean}
     * @method
     * @private
     */
    _$isUpdated (): boolean
    {
        return this._$updated;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$doChanged (): void
    {
        this._$updated  = true;
        $doUpdated();
    }
}
