import { execute as samplerCacheGenerateKeyService } from "./SamplerCacheGenerateKeyService";

/**
 * @description 頻繁に使用されるサンプラーを事前に作成
 *              Pre-create commonly used samplers
 *
 * @param  {GPUDevice} device
 * @param  {Map<string, GPUSampler>} cache
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    cache: Map<string, GPUSampler>
): void => {
    const createAndCache = (
        minFilter: GPUFilterMode,
        magFilter: GPUFilterMode,
        addressModeU: GPUAddressMode,
        addressModeV: GPUAddressMode
    ): void => {
        const key = samplerCacheGenerateKeyService(minFilter, magFilter, addressModeU, addressModeV);

        if (!cache.has(key)) {
            const sampler = device.createSampler({
                minFilter,
                magFilter,
                addressModeU,
                addressModeV
            });
            cache.set(key, sampler);
        }
    };

    // リニアクランプ（最も一般的）
    createAndCache("linear", "linear", "clamp-to-edge", "clamp-to-edge");

    // ニアレストクランプ
    createAndCache("nearest", "nearest", "clamp-to-edge", "clamp-to-edge");

    // リニアリピート
    createAndCache("linear", "linear", "repeat", "repeat");

    // ニアレストリピート
    createAndCache("nearest", "nearest", "repeat", "repeat");

    // リニアミラーリピート
    createAndCache("linear", "linear", "mirror-repeat", "mirror-repeat");
};
