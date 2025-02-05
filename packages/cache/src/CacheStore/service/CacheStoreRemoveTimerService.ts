import type { CacheStore } from "../../CacheStore";

/**
 * @description キャッシュストアの指定IDの削除フラグを立てる
 *              Set the deletion flag of the specified ID in the cache store
 *
 * @param  {CacheStore} cache_store
 * @param  {Map} data_store
 * @param  {Map} trash_store
 * @param  {string} id
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    cache_store: CacheStore,
    data_store: Map<string, Map<string, any>>,
    trash_store: Map<string, Map<string, any>>,
    id: string
): void => {

    if (trash_store.has(id)) {
        return ;
    }

    const data = data_store.get(id) as Map<string, any>;
    if (!data) {
        return ;
    }

    data.set("trash", true);
    trash_store.set(id, data);

    if (cache_store.$timerId !== null) {
        return ;
    }

    // 5秒後に削除処理を行う
    cache_store.$timerId = setTimeout((): void =>
    {
        for (const [id, data] of trash_store) {

            if (!data.has("trash")) {
                continue ;
            }

            cache_store.removeById(id);
            cache_store.$removeIds.push(+id);
        }

        trash_store.clear();
        cache_store.$timerId = null;
    }, 5000);
};