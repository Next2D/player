import type { CacheStore } from "../../CacheStore";
import {
    $getMap,
    $poolMap
} from "../../CacheUtil";

/**
 * @description キャッシュストアにデータをセット
 *              Set data in the cache store
 *
 * @param  {CacheStore} cache_store
 * @param  {Map} data_store
 * @param  {array} keys
 * @param  {*} value
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    cache_store: CacheStore,
    data_store: Map<string, Map<string, any>>,
    unique_key: string,
    key: string,
    value: any = null
): void => {

    // init
    if (!data_store.has(unique_key)) {
        data_store.set(unique_key, $getMap());
    }

    const data = data_store.get(unique_key) as NonNullable<Map<string, any>>;
    if (value === null) {

        if (!data.has(key)) {
            return ;
        }

        cache_store.destroy(data.get(key));

        data.delete(key);

        if (!data.size) {
            data_store.delete(unique_key);
            $poolMap(data);
        }

        return ;
    }

    // set cache
    data.set(key, value);

    // LRU: 上限が設定されている場合(メインスレッドのopt-in)、
    // 触れたIDを最新に更新し、超過分を古い順にevictする。
    // evictは既存のタイマー削除と同じ経路(removeById + $removeIds)で
    // worker側のGPUリソースも解放される。上限0(デフォルト)では従来挙動のまま。
    if (cache_store.$maxStoreSize > 0) {

        data_store.delete(unique_key);
        data_store.set(unique_key, data);

        while (data_store.size > cache_store.$maxStoreSize) {

            const oldestId = data_store.keys().next().value as string;

            // 触れたばかりのIDは削除しない(上限1未満の設定に対する安全弁)
            if (oldestId === unique_key) {
                break;
            }

            cache_store.removeById(oldestId);
            cache_store.$removeIds.push(+oldestId);
        }
    }
};