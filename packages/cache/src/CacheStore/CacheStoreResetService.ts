import type { CacheStore } from "../CacheStore";
import { $poolMap } from "../CacheUtil";

/**
 * @description キャッシュストアを全てリセット
 *              Reset all cache stores
 *
 * @param  {CacheStore} cache_store
 * @param  {Map} data_store
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    cache_store: CacheStore,
    data_store: Map<string, Map<string, any>>
): void => {

    for (const data of data_store.values()) {

        for (const value of data.values()) {
            cache_store.destroy(value);
        }

        $poolMap(data);
    }

    data_store.clear();
};