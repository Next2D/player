/**
 * @description フィルター用グラデーションLUTテクスチャのキャッシュエントリ
 *              Cache entry for filter gradient LUT texture
 */
interface IFilterLUTCacheEntry {
    texture: GPUTexture;
    lastUsed: number;
}

/**
 * @description フィルター用グラデーションLUTテクスチャのキャッシュ
 *              Cache for filter gradient LUT textures
 *
 * @type {Map<string, IFilterLUTCacheEntry>}
 * @private
 */
const $filterLutCache: Map<string, IFilterLUTCacheEntry> = new Map();

/**
 * @description キャッシュの最大サイズ
 *              Maximum cache size
 *
 * @type {number}
 * @const
 */
const MAX_CACHE_SIZE: number = 16;

/**
 * @description 現在のフレーム番号
 *              Current frame number
 *
 * @type {number}
 * @private
 */
let $currentFrame: number = 0;

/**
 * @description フィルターグラデーションパラメータからキャッシュキーを生成
 *              Generate cache key from filter gradient parameters
 *
 * @param  {Float32Array} ratios - 比率配列
 * @param  {Float32Array} colors - 色配列
 * @param  {Float32Array} alphas - アルファ配列
 * @return {string}
 * @method
 * @protected
 */
export const $generateFilterLUTCacheKey = (
    ratios: Float32Array,
    colors: Float32Array,
    alphas: Float32Array
): string =>
{
    // 全ての値を含むキーを生成
    const parts: string[] = [];
    const length = ratios.length;

    for (let i = 0; i < length; i++) {
        // ratio, color, alpha を組み合わせてキーを生成
        parts.push(
            `${(ratios[i] | 0).toString(36)}_${(colors[i] | 0).toString(36)}_${(alphas[i] * 1000 | 0).toString(36)}`
        );
    }

    return parts.join(":");
};

/**
 * @description キャッシュからフィルターLUTテクスチャを取得
 *              Get filter LUT texture from cache
 *
 * @param  {string} key
 * @return {GPUTexture | null}
 * @method
 * @protected
 */
export const $getCachedFilterLUT = (key: string): GPUTexture | null =>
{
    const entry = $filterLutCache.get(key);
    if (entry) {
        entry.lastUsed = $currentFrame;
        return entry.texture;
    }
    return null;
};

/**
 * @description フィルターLUTテクスチャをキャッシュに追加
 *              Add filter LUT texture to cache
 *
 * @param  {string} key
 * @param  {GPUTexture} texture
 * @return {void}
 * @method
 * @protected
 */
export const $setCachedFilterLUT = (key: string, texture: GPUTexture): void =>
{
    // キャッシュサイズ制限を超える場合、最も古いエントリを削除
    if ($filterLutCache.size >= MAX_CACHE_SIZE) {
        let oldestKey: string | null = null;
        let oldestFrame = Infinity;

        for (const [k, v] of $filterLutCache) {
            if (v.lastUsed < oldestFrame) {
                oldestFrame = v.lastUsed;
                oldestKey = k;
            }
        }

        if (oldestKey) {
            const oldEntry = $filterLutCache.get(oldestKey);
            if (oldEntry) {
                oldEntry.texture.destroy();
            }
            $filterLutCache.delete(oldestKey);
        }
    }

    $filterLutCache.set(key, {
        texture,
        lastUsed: $currentFrame
    });
};

/**
 * @description フレームを進める（キャッシュの有効期限管理用）
 *              Advance frame (for cache expiration management)
 *
 * @return {void}
 * @method
 * @protected
 */
export const $advanceFilterLUTFrame = (): void =>
{
    $currentFrame++;
};

/**
 * @description キャッシュをクリア
 *              Clear cache
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearFilterLUTCache = (): void =>
{
    // 全てのテクスチャを破棄
    for (const entry of $filterLutCache.values()) {
        entry.texture.destroy();
    }
    $filterLutCache.clear();
};

/**
 * @description キャッシュサイズを返却
 *              Returns cache size
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getFilterLUTCacheSize = (): number =>
{
    return $filterLutCache.size;
};
