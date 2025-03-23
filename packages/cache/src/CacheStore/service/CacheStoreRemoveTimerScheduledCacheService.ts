import type { CacheStore } from "../../CacheStore";

/**
 * @description タイマーでセットされた削除フラグを持つIDをキャッシュストアから削除する
 *              Remove the ID with the deletion flag set by the timer from the cache store
 *
 * @param  {CacheStore} cache_store
 * @param  {Map} trash_store
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    cache_store: CacheStore,
    trash_store: Map<string, Map<string, any>>
): void => {

    if (!trash_store.size) {
        return ;
    }

    for (const [id, data] of trash_store) {

        if (!data.has("trash")) {
            continue ;
        }

        cache_store.removeById(id);
        cache_store.$removeIds.push(+id);
    }

    trash_store.clear();
    cache_store.$removeCache = false;
};