/**
 * @description 指定のキーからデータを取得
 *              Get data from the specified key
 *
 * @param  {Map} data_store
 * @param  {string} unique_key
 * @param  {string} key
 * @return {*}
 * @method
* @public
*/
export const execute = (
    data_store: Map<string, Map<string, any>>,
    unique_key: string,
    key: string
): any => {

    if (!data_store.has(unique_key)) {
        return null;
    }

    const data = data_store.get(unique_key) as NonNullable<Map<string, any>>;
    if (!data.size || !data.has(key)) {
        return null;
    }

    return data.get(key);
};