import type { ConvolutionFilter } from "../../ConvolutionFilter";

/**
 * @description フィルターの設定値を配列で返却します。
 *              Returns an array of filter settings.
 *
 * @param  {ConvolutionFilter} convolution_filter
 * @return {Array<number | number[] | boolean | null>}
 * @method
 * @protected
 */
export const execute = (convolution_filter: ConvolutionFilter): Array<number | number[] | boolean | null> =>
{
    return [
        convolution_filter.$filterType,
        convolution_filter.matrixX,
        convolution_filter.matrixY,
        convolution_filter.matrix,
        convolution_filter.divisor,
        convolution_filter.bias,
        convolution_filter.preserveAlpha,
        convolution_filter.clamp,
        convolution_filter.color,
        convolution_filter.alpha
    ];
};