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
};