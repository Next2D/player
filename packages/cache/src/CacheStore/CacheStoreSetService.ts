import type { CacheStore } from "../CacheStore";
import {
    $getMap,
    $poolMap
} from "../CacheUtil";

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
    keys: string[],
    value: any = null
): void => {

    const id: string   = keys[0];
    const type: string = keys[1];

    // init
    if (!data_store.has(id)) {
        data_store.set(id, $getMap());
    }

    const data = data_store.get(id) as NonNullable<Map<string, any>>;
    if (value === null) {

        if (!data.has(type)) {
            return ;
        }

        cache_store.destroy(data.get(type));

        data.delete(type);

        if (!data.size) {
            data_store.delete(id);
            $poolMap(data);
        }

        return ;
    }

    // set cache
    data.set(type, value);
};