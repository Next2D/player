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

    // 同じ内容の表示オブジェクトは、このキャッシュを共有する。共有している別のオブジェクトがまだ
    // ステージにあるときに捨ててしまうと、そのオブジェクトは次の描画で全部作り直しになる。
    // 表示オブジェクトは内側の Map を直接持ち、自分の ID の印があるかだけを見て使い続けるので、
    // ここで印を外す。まだ描かれているオブジェクトは、次の描画で印が無いことに気づいて
    // CacheStore.get を通り、そこで削除の予約が取り消される。描かれなければ、従来どおり捨てられる。
    // Display objects with the same content share this cache. Discarding it while another object
    // that shares it is still on the stage makes that object rebuild everything on its next draw.
    // A display object keeps the inner Map directly and only checks its own ID marker, so the marker
    // is removed here: an object that is still being drawn notices it on the next draw, goes through
    // CacheStore.get and the scheduled removal is cancelled there. Otherwise it is discarded as before.
    data.delete(id);

    if (cache_store.$timerId !== null) {
        clearTimeout(cache_store.$timerId);
    }

    // 1秒後に削除処理を行う
    cache_store.$removeCache = false;
    cache_store.$timerId = setTimeout((): void =>
    {
        cache_store.$removeCache = true;
        cache_store.$timerId     = null;
    }, 1000);
};