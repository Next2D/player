/**
 * @description サンプラーのキーを生成
 *              Generate sampler cache key
 *
 * @param  {GPUFilterMode} minFilter
 * @param  {GPUFilterMode} magFilter
 * @param  {GPUAddressMode} addressModeU
 * @param  {GPUAddressMode} addressModeV
 * @return {string}
 * @method
 * @protected
 */
export const execute = (
    minFilter: GPUFilterMode,
    magFilter: GPUFilterMode,
    addressModeU: GPUAddressMode,
    addressModeV: GPUAddressMode
): string => {
    return `${minFilter}_${magFilter}_${addressModeU}_${addressModeV}`;
};
