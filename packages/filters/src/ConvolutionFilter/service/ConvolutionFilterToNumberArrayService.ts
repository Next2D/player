import type { ConvolutionFilter } from "../../ConvolutionFilter";

/**
 * @description フィルターの設定値を数値配列で返却します。
 *              Returns a numeric array of filter settings.
 *
 * @param  {ConvolutionFilter} convolution_filter
 * @return {number[]}
 * @method
 * @protected
 */
export const execute = (convolution_filter: ConvolutionFilter): number[] =>
{
    const matrix: number[] = convolution_filter.matrix || [];
    return [
        convolution_filter.$filterType,
        convolution_filter.matrixX,
        convolution_filter.matrixY,
        ...matrix,
        convolution_filter.divisor,
        convolution_filter.bias,
        +convolution_filter.preserveAlpha,
        +convolution_filter.clamp,
        convolution_filter.color,
        convolution_filter.alpha
    ];
};