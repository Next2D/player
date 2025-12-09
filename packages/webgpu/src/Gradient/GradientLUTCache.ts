/**
 * @description グラデーションLUTテクスチャのキャッシュエントリ
 *              Cache entry for gradient LUT texture
 */
interface IGradientLUTCacheEntry {
    texture: GPUTexture;
    lastUsed: number;
}

/**
 * @description グラデーションLUTテクスチャのキャッシュ
 *              Cache for gradient LUT textures
 *
 * @type {Map<string, IGradientLUTCacheEntry>}
 * @private
 */
const $lutCache: Map<string, IGradientLUTCacheEntry> = new Map();

/**
 * @description キャッシュの最大サイズ
 *              Maximum cache size
 *
 * @type {number}
 * @const
 */
const MAX_CACHE_SIZE: number = 32;

/**
 * @description 現在のフレーム番号
 *              Current frame number
 *
 * @type {number}
 * @private
 */
let $currentFrame: number = 0;

/**
 * @description グラデーションストップからキャッシュキーを生成
 *              Generate cache key from gradient stops
 *              色の変化を正確に検出するため、全ての値を含むキーを生成
 *              Generate a key that includes all values to accurately detect color changes
 *
 * @param  {number[]} stops
 * @param  {number} interpolation
 * @return {string}
 * @method
 * @protected
 */
export const $generateCacheKey = (stops: number[], interpolation: number): string =>
{
    // 全ての値を含むキーを生成して衝突を防ぐ
    // Generate a key including all values to prevent collisions
    // stops配列: [ratio, r, g, b, a, ratio, r, g, b, a, ...]
    // 各値を固定小数点(3桁)で文字列化
    const parts: string[] = new Array(stops.length);
    for (let i = 0; i < stops.length; i++) {
        parts[i] = (stops[i] * 1000 | 0).toString(36);
    }
    return `${interpolation}_${parts.join("_")}`;
};

/**
 * @description キャッシュからLUTテクスチャを取得
 *              Get LUT texture from cache
 *
 * @param  {string} key
 * @return {GPUTexture | null}
 * @method
 * @protected
 */
export const $getCachedLUT = (key: string): GPUTexture | null =>
{
    const entry = $lutCache.get(key);
    if (entry) {
        entry.lastUsed = $currentFrame;
        return entry.texture;
    }
    return null;
};

/**
 * @description LUTテクスチャをキャッシュに追加
 *              Add LUT texture to cache
 *
 * @param  {string} key
 * @param  {GPUTexture} texture
 * @return {void}
 * @method
 * @protected
 */
export const $setCachedLUT = (key: string, texture: GPUTexture): void =>
{
    // キャッシュサイズ制限を超える場合、最も古いエントリを削除
    if ($lutCache.size >= MAX_CACHE_SIZE) {
        let oldestKey: string | null = null;
        let oldestFrame = Infinity;

        for (const [k, v] of $lutCache) {
            if (v.lastUsed < oldestFrame) {
                oldestFrame = v.lastUsed;
                oldestKey = k;
            }
        }

        if (oldestKey) {
            const oldEntry = $lutCache.get(oldestKey);
            if (oldEntry) {
                oldEntry.texture.destroy();
            }
            $lutCache.delete(oldestKey);
        }
    }

    $lutCache.set(key, {
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
export const $advanceFrame = (): void =>
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
export const $clearLUTCache = (): void =>
{
    // 全てのテクスチャを破棄
    for (const entry of $lutCache.values()) {
        entry.texture.destroy();
    }
    $lutCache.clear();
};

/**
 * @description キャッシュサイズを返却
 *              Returns cache size
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getLUTCacheSize = (): number =>
{
    return $lutCache.size;
};
