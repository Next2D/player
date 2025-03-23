import type { ConvolutionFilter } from "../../ConvolutionFilter";

/**
 * @description フィルターを適用できるかどうかを返します。
 *              Returns whether the filter can be applied.
 *
 * @param  {ConvolutionFilter} convolution_filter
 * @return {boolean}
 * @method
 * @private
 */
export const execute = (convolution_filter: ConvolutionFilter): boolean =>
{
    return convolution_filter.matrix !== null
        && convolution_filter.matrixX * convolution_filter.matrixY === convolution_filter.matrix.length;
};