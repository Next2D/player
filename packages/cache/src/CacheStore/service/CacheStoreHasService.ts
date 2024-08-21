/**
 * @description 指定キーのキャッシュが存在するかどうか
 *              Whether the specified key cache exists
 *
 * @param  {Map} data_store
 * @param  {array} keys
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (
    data_store: Map<string, Map<string, any>>,
    keys: string[]
): boolean => {
    const id: string = keys[0];
    return !data_store.has(id)
        ? false
        : (data_store.get(id) as NonNullable<Map<string, any>>).has(keys[1]);
};