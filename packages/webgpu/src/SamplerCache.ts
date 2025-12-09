import { execute as samplerCacheGetOrCreateService } from "./SamplerCache/service/SamplerCacheGetOrCreateService";
import { execute as samplerCacheCreateCommonSamplersService } from "./SamplerCache/service/SamplerCacheCreateCommonSamplersService";

/**
 * @description サンプラーキャッシュマネージャー
 *              Sampler cache manager for WebGPU optimization
 *
 *              WebGPUではサンプラーの作成コストが高いため、
 *              同じパラメータの組み合わせでキャッシュを再利用する
 */
export class SamplerCache
{
    private device: GPUDevice;
    private cache: Map<string, GPUSampler>;

    /**
     * @param {GPUDevice} device
     * @constructor
     */
    constructor(device: GPUDevice)
    {
        this.device = device;
        this.cache = new Map();

        // 頻繁に使用されるサンプラーを事前に作成
        samplerCacheCreateCommonSamplersService(device, this.cache);
    }

    /**
     * @description サンプラーを取得または作成
     * @param {GPUFilterMode} minFilter
     * @param {GPUFilterMode} magFilter
     * @param {GPUAddressMode} addressModeU
     * @param {GPUAddressMode} addressModeV
     * @return {GPUSampler}
     */
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

    /**
     * @description 一般的なサンプラーを取得（ショートカットメソッド）
     * @return {GPUSampler}
     */
    getLinearClamp(): GPUSampler
    {
        return this.getOrCreate("linear", "linear", "clamp-to-edge", "clamp-to-edge");
    }

    /**
     * @description ニアレストクランプサンプラーを取得
     * @return {GPUSampler}
     */
    getNearestClamp(): GPUSampler
    {
        return this.getOrCreate("nearest", "nearest", "clamp-to-edge", "clamp-to-edge");
    }

    /**
     * @description リニアリピートサンプラーを取得
     * @return {GPUSampler}
     */
    getLinearRepeat(): GPUSampler
    {
        return this.getOrCreate("linear", "linear", "repeat", "repeat");
    }

    /**
     * @description ニアレストリピートサンプラーを取得
     * @return {GPUSampler}
     */
    getNearestRepeat(): GPUSampler
    {
        return this.getOrCreate("nearest", "nearest", "repeat", "repeat");
    }

    /**
     * @description スムース設定とリピート設定からサンプラーを取得
     * @param {boolean} smooth
     * @param {boolean} repeat
     * @return {GPUSampler}
     */
    getBySmoothRepeat(smooth: boolean, repeat: boolean): GPUSampler
    {
        const filter: GPUFilterMode = smooth ? "linear" : "nearest";
        const addressMode: GPUAddressMode = repeat ? "repeat" : "clamp-to-edge";
        return this.getOrCreate(filter, filter, addressMode, addressMode);
    }

    /**
     * @description キャッシュ統計を取得
     * @return {{ size: number }}
     */
    getStats(): { size: number }
    {
        return {
            size: this.cache.size
        };
    }

    /**
     * @description 解放
     * @return {void}
     */
    dispose(): void
    {
        this.cache.clear();
    }
}

/**
 * @description グローバルサンプラーキャッシュインスタンス
 */
let $samplerCache: SamplerCache | null = null;

/**
 * @description サンプラーキャッシュを初期化
 * @param {GPUDevice} device
 * @return {void}
 */
export const initSamplerCache = (device: GPUDevice): void =>
{
    $samplerCache = new SamplerCache(device);
};

/**
 * @description サンプラーキャッシュを取得
 * @return {SamplerCache | null}
 */
export const getSamplerCache = (): SamplerCache | null =>
{
    return $samplerCache;
};

/**
 * @description サンプラーキャッシュをクリア
 * @return {void}
 */
export const clearSamplerCache = (): void =>
{
    if ($samplerCache) {
        $samplerCache.dispose();
    }
};
