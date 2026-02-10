import { execute as samplerCacheGenerateKeyService } from "./SamplerCacheGenerateKeyService";

/**
 * @description サンプラーを取得または作成
 *              Get or create sampler
 *
 * @param  {GPUDevice} device
 * @param  {Map<string, GPUSampler>} cache
 * @param  {GPUFilterMode} minFilter
 * @param  {GPUFilterMode} magFilter
 * @param  {GPUAddressMode} addressModeU
 * @param  {GPUAddressMode} addressModeV
 * @return {GPUSampler}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    cache: Map<string, GPUSampler>,
    minFilter: GPUFilterMode,
    magFilter: GPUFilterMode,
    addressModeU: GPUAddressMode,
    addressModeV: GPUAddressMode
): GPUSampler => {
    const key = samplerCacheGenerateKeyService(minFilter, magFilter, addressModeU, addressModeV);

    const cached = cache.get(key);
    if (cached) {
        return cached;
    }

    const sampler = device.createSampler({
        minFilter,
        magFilter,
        addressModeU,
        addressModeV
    });

    cache.set(key, sampler);
    return sampler;
};
