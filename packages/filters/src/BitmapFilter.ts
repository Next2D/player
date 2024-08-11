import type { IBounds } from "./interface/IBounds";

/**
 * @description BitmapFilter クラスは、すべてのイメージフィルター効果の基本クラスです。
 *              BevelFilter、BlurFilter、ColorMatrixFilter、ConvolutionFilter、DisplacementMapFilter、DropShadowFilter、GlowFilter、GradientBevelFilter、
 *              および GradientGlowFilter クラスはすべて、BitmapFilter クラスを継承します。
 *              このフィルター効果は、あらゆる表示オブジェクトに適用できます。
 *
 *              The BitmapFilter class is the base class for all image filter effects.
 *              The BevelFilter, BlurFilter, ColorMatrixFilter, ConvolutionFilter, DisplacementMapFilter, DropShadowFilter, GlowFilter, GradientBevelFilter,
 *              and GradientGlowFilter classes all extend the BitmapFilter class.
 *              You can apply these filter effects to any display object.
 *              You can neither directly instantiate nor extend BitmapFilter.
 *
 * @class
 * @memberOf next2d.filters
 */
export class BitmapFilter
{
    /**
     * @description フィルターが更新されたかどうかを示します。
     *              Indicates whether the filter is updated.
     * 
     * @type {boolean}
     * @default true
     * @public
     */
    public $updated: boolean;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.$updated = true;
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
        return true;
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
        return bounds;
    }
}
