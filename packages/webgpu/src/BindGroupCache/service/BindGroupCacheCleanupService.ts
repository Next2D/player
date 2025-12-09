import type { ICachedBindGroup } from "../interface/ICachedBindGroup";

/**
 * @description 古いキャッシュエントリをクリーンアップ
 *              Cleanup old cache entries
 *
 * @param  {Map<string, ICachedBindGroup>} cache
 * @param  {number} currentFrame
 * @param  {number} threshold - フレーム数閾値
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    cache: Map<string, ICachedBindGroup>,
    currentFrame: number,
    threshold: number
): void => {
    const frameThreshold = currentFrame - threshold;

    for (const [key, entry] of cache.entries()) {
        if (entry.lastUsedFrame < frameThreshold) {
            cache.delete(key);
        }
    }
};
