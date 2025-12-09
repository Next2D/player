import type { ICachedBindGroup } from "../interface/ICachedBindGroup";

/**
 * @description 最も古いエントリを削除
 *              Evict the oldest cache entry
 *
 * @param  {Map<string, ICachedBindGroup>} cache
 * @return {void}
 * @method
 * @protected
 */
export const execute = (cache: Map<string, ICachedBindGroup>): void => {
    let oldestKey: string | null = null;
    let oldestFrame = Infinity;

    for (const [key, entry] of cache.entries()) {
        if (entry.lastUsedFrame < oldestFrame) {
            oldestFrame = entry.lastUsedFrame;
            oldestKey = key;
        }
    }

    if (oldestKey) {
        cache.delete(oldestKey);
    }
};
