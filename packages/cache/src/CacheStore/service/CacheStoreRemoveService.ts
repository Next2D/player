import { $poolMap } from "../../CacheUtil";

/**
 * @description キャッシュストアから指定したキャッシュを削除
 *              Remove the specified cache from the cache store
 *
 * @param  {Map} data_store
 * @param  {string} id
 * @param  {string} type
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    data_store: Map<string, Map<string, any>>,
    id: string,
    type: string
): void => {

    if (!data_store.has(id)) {
        return ;
    }

    const data: Map<string, any> = data_store.get(id) as NonNullable<Map<string, any>>;
    if (!data.has(type)) {
        return ;
    }

    // delete key
    data.delete(type);

    if (!data.size) {
        $poolMap(data);
        data_store.delete(id);
    }
};