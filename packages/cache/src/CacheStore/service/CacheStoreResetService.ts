import type { CacheStore } from "../../CacheStore";
import { $poolMap } from "../../CacheUtil";

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
    data_store: Map<string, Map<string, any>>,
    trash_store: Map<string, Map<string, any>>
): void => {

    // タイマーをクリア
    trash_store.clear();
    if (cache_store.$timerId !== null) {
        clearTimeout(cache_store.$timerId);
    }

    for (const data of data_store.values()) {

        for (const value of data.values()) {
            if (!value) {
                continue;
            }
            cache_store.destroy(value);
        }

        $poolMap(data);
    }

    data_store.clear();
};