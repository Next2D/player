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

    // LRU: 上限が設定されている場合(メインスレッドのopt-in)、触れたIDを最新に更新する。
    // 上限を超えていても、ここでは削除しない。描画情報の生成中に削除すると、削除したIDを
    // 同じ生成の中で作り直すことがあり、その場合 worker には「作り直しの描画」のあとに
    // 「削除」が届いて、作り直したキャッシュが消える(メイン側はキャッシュ済みと認識した
    // ままなので、以後その DisplayObject が描画されなくなる)。
    // 超過分の削除は、描画情報を worker に送ったあとで evictOverLimit() が行う。
    // 上限0(デフォルト)では従来挙動のまま。
    if (cache_store.$maxStoreSize > 0) {

        data_store.delete(unique_key);
        data_store.set(unique_key, data);

        if (data_store.size > cache_store.$maxStoreSize) {
            cache_store.$overLimit = true;
        }
    }
};