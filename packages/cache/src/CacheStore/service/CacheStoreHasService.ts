/**
 * @description 指定キーのキャッシュが存在するかどうか
 *              Whether the specified key cache exists
 *
 * @param  {Map} data_store
 * @param  {string} unique_key
 * @param  {string} key
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (
    data_store: Map<string, Map<string, any>>,
    unique_key: string,
    key: string = ""
): boolean => {

    if (!key) {
        return data_store.has(unique_key);
    }

    return !data_store.has(unique_key)
        ? false
        : (data_store.get(unique_key) as Map<string, any>).has(key);
};