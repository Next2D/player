import { execute as samplerCacheGetOrCreateService } from "./SamplerCache/service/SamplerCacheGetOrCreateService";
import { execute as samplerCacheCreateCommonSamplersService } from "./SamplerCache/service/SamplerCacheCreateCommonSamplersService";

export class SamplerCache
{
    private device: GPUDevice;
    private cache: Map<string, GPUSampler>;

    constructor(device: GPUDevice)
    {
        this.device = device;
        this.cache = new Map();

        samplerCacheCreateCommonSamplersService(device, this.cache);
    }

    getOrCreate(
        minFilter: GPUFilterMode,
        magFilter: GPUFilterMode,
        addressModeU: GPUAddressMode,
        addressModeV: GPUAddressMode
    ): GPUSampler {
        return samplerCacheGetOrCreateService(
            this.device,
            this.cache,
            minFilter,
            magFilter,
            addressModeU,
            addressModeV
        );
    }

    getLinearClamp(): GPUSampler
    {
        return this.getOrCreate("linear", "linear", "clamp-to-edge", "clamp-to-edge");
    }

    getNearestClamp(): GPUSampler
    {
        return this.getOrCreate("nearest", "nearest", "clamp-to-edge", "clamp-to-edge");
    }

    getLinearRepeat(): GPUSampler
    {
        return this.getOrCreate("linear", "linear", "repeat", "repeat");
    }

    getNearestRepeat(): GPUSampler
    {
        return this.getOrCreate("nearest", "nearest", "repeat", "repeat");
    }

    getBySmoothRepeat(smooth: boolean, repeat: boolean): GPUSampler
    {
        const filter: GPUFilterMode = smooth ? "linear" : "nearest";
        const addressMode: GPUAddressMode = repeat ? "repeat" : "clamp-to-edge";
        return this.getOrCreate(filter, filter, addressMode, addressMode);
    }

    getStats(): { size: number }
    {
        return {
            "size": this.cache.size
        };
    }

    dispose(): void
    {
        this.cache.clear();
    }
}

let $samplerCache: SamplerCache | null = null;

export const initSamplerCache = (device: GPUDevice): void =>
{
    $samplerCache = new SamplerCache(device);
};

export const getSamplerCache = (): SamplerCache | null =>
{
    return $samplerCache;
};

export const clearSamplerCache = (): void =>
{
    if ($samplerCache) {
        $samplerCache.dispose();
    }
};
