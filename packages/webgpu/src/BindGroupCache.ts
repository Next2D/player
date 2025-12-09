/**
 * @description BindGroupキャッシュマネージャー
 *              BindGroup cache manager for WebGPU optimization
 *
 *              WebGPUではBindGroupの作成コストが高いため、
 *              同じリソースの組み合わせでキャッシュを再利用する
 */

interface ICachedBindGroup {
    bindGroup: GPUBindGroup;
    lastUsedFrame: number;
}

/**
 * @description BindGroupキャッシュのフレームベースのクリーンアップ閾値
 */
const CACHE_CLEANUP_THRESHOLD = 300; // 5秒（60FPS想定）

/**
 * @description キャッシュの最大エントリ数
 */
const MAX_CACHE_ENTRIES = 256;

/**
 * @description BindGroupキャッシュマネージャー
 */
export class BindGroupCache
{
    private device: GPUDevice;
    private cache: Map<string, ICachedBindGroup>;
    private currentFrame: number;

    /**
     * @param {GPUDevice} device
     * @constructor
     */
    constructor(device: GPUDevice)
    {
        this.device = device;
        this.cache = new Map();
        this.currentFrame = 0;
    }

    /**
     * @description フレーム開始時に呼び出し
     * @return {void}
     */
    beginFrame(): void
    {
        this.currentFrame++;

        // 定期的にキャッシュをクリーンアップ
        if (this.currentFrame % 60 === 0) {
            this.cleanup();
        }
    }

    /**
     * @description BindGroupを取得または作成
     * @param {string} key - キャッシュキー
     * @param {GPUBindGroupLayout} layout - BindGroupレイアウト
     * @param {GPUBindGroupEntry[]} entries - BindGroupエントリ
     * @return {GPUBindGroup}
     */
    getOrCreate(
        key: string,
        layout: GPUBindGroupLayout,
        entries: GPUBindGroupEntry[]
    ): GPUBindGroup {
        const cached = this.cache.get(key);

        if (cached) {
            cached.lastUsedFrame = this.currentFrame;
            return cached.bindGroup;
        }

        // 新規作成
        const bindGroup = this.device.createBindGroup({
            layout,
            entries
        });

        // キャッシュが満杯なら最も古いエントリを削除
        if (this.cache.size >= MAX_CACHE_ENTRIES) {
            this.evictOldest();
        }

        this.cache.set(key, {
            bindGroup,
            lastUsedFrame: this.currentFrame
        });

        return bindGroup;
    }

    /**
     * @description サンプラー + テクスチャのBindGroupを取得または作成
     * @param {string} cacheKey - キャッシュキー
     * @param {GPUBindGroupLayout} layout - BindGroupレイアウト
     * @param {GPUSampler} sampler - サンプラー
     * @param {GPUTextureView} textureView - テクスチャビュー
     * @return {GPUBindGroup}
     */
    getOrCreateSamplerTexture(
        cacheKey: string,
        layout: GPUBindGroupLayout,
        sampler: GPUSampler,
        textureView: GPUTextureView
    ): GPUBindGroup {
        return this.getOrCreate(cacheKey, layout, [
            { binding: 0, resource: sampler },
            { binding: 1, resource: textureView }
        ]);
    }

    /**
     * @description ユニフォームバッファ + サンプラー + テクスチャのBindGroupを取得または作成
     * @param {string} cacheKey - キャッシュキー
     * @param {GPUBindGroupLayout} layout - BindGroupレイアウト
     * @param {GPUBuffer} uniformBuffer - ユニフォームバッファ
     * @param {GPUSampler} sampler - サンプラー
     * @param {GPUTextureView} textureView - テクスチャビュー
     * @return {GPUBindGroup}
     */
    getOrCreateUniformSamplerTexture(
        cacheKey: string,
        layout: GPUBindGroupLayout,
        uniformBuffer: GPUBuffer,
        sampler: GPUSampler,
        textureView: GPUTextureView
    ): GPUBindGroup {
        return this.getOrCreate(cacheKey, layout, [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: textureView }
        ]);
    }

    /**
     * @description 古いキャッシュエントリをクリーンアップ
     * @return {void}
     * @private
     */
    private cleanup(): void
    {
        const threshold = this.currentFrame - CACHE_CLEANUP_THRESHOLD;

        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastUsedFrame < threshold) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * @description 最も古いエントリを削除
     * @return {void}
     * @private
     */
    private evictOldest(): void
    {
        let oldestKey: string | null = null;
        let oldestFrame = Infinity;

        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastUsedFrame < oldestFrame) {
                oldestFrame = entry.lastUsedFrame;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }

    /**
     * @description キャッシュをクリア
     * @return {void}
     */
    clear(): void
    {
        this.cache.clear();
    }

    /**
     * @description キャッシュ統計を取得
     * @return {{ size: number, currentFrame: number }}
     */
    getStats(): { size: number; currentFrame: number }
    {
        return {
            size: this.cache.size,
            currentFrame: this.currentFrame
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
 * @description グローバルBindGroupキャッシュインスタンス
 */
let $bindGroupCache: BindGroupCache | null = null;

/**
 * @description BindGroupキャッシュを初期化
 * @param {GPUDevice} device
 * @return {void}
 */
export const initBindGroupCache = (device: GPUDevice): void =>
{
    $bindGroupCache = new BindGroupCache(device);
};

/**
 * @description BindGroupキャッシュを取得
 * @return {BindGroupCache | null}
 */
export const getBindGroupCache = (): BindGroupCache | null =>
{
    return $bindGroupCache;
};

/**
 * @description BindGroupキャッシュをクリア
 * @return {void}
 */
export const clearBindGroupCache = (): void =>
{
    if ($bindGroupCache) {
        $bindGroupCache.clear();
    }
};
