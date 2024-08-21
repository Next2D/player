import { CacheStore } from "../../CacheStore";
import { $poolMap } from "../../CacheUtil";

/**
 * @description 指定IDのキャッシュを削除する
 *              Delete the cache for the specified ID
 *
 * @param {CacheStore} cache_store
 * @param {Map} data_store
 * @param {string} id
 */
export const execute = (
    cache_store: CacheStore,
    data_store: Map<string, Map<string, any>>,
    id: string
): void => {

    if (!data_store.has(id)) {
        return ;
    }

    const data = data_store.get(id) as NonNullable<Map<string, any>>;
    for (const value of data.values()) {
        cache_store.destroy(value);
    }

    data_store.delete(id);
    $poolMap(data);
};