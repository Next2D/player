import { $cacheStore } from "@next2d/cache";
import { $context } from "../../RendererUtil";

/**
 * @description キャッシュキーを削除
 *              Remove cache key
 *
 * @param  {Float32Array} remove_cache_keys
 * @return {void}
 * @method
 * @public
 */
export const execute = (remove_cache_keys: Float32Array): void =>
{
    for (let idx = 0; idx < remove_cache_keys.length; ++idx) {
        const cacheKey = `${remove_cache_keys[idx]}`;
        if (!$cacheStore.has(cacheKey)) {
            continue;
        }

        const cache = $cacheStore.getById(cacheKey);
        for (const node of cache.values()) {
            $context.removeNode(node);
        }

        $cacheStore.removeById(cacheKey);
    }
};