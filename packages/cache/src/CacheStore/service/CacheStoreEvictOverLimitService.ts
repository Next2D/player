import type { CacheStore } from "../../CacheStore";

/**
 * @description LRU上限($maxStoreSize)を超えた分のキャッシュを、参照が古い順に削除する。
 *              削除したIDは$removeIdsに積み、worker側のGPUリソース(アトラス領域等)も
 *              解放されるようにする。描画情報をworkerに送ったあとに呼ぶこと。
 *              Removes caches beyond the LRU limit ($maxStoreSize), least recently used
 *              first. Removed IDs are pushed to $removeIds so that the worker-side GPU
 *              resources (atlas regions etc.) are released as well. Call this after the
 *              render queue has been posted to the worker.
 *
 * @param  {CacheStore} cache_store
 * @param  {Map} data_store
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    cache_store: CacheStore,
    data_store: Map<string, Map<string, any>>
): void => {

    cache_store.$overLimit = false;

    if (cache_store.$maxStoreSize <= 0) {
        return ;
    }

    while (data_store.size > cache_store.$maxStoreSize) {
        const oldestId = data_store.keys().next().value as string;
        cache_store.removeById(oldestId);
        cache_store.$removeIds.push(+oldestId);
    }
};
