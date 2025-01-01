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

    const data = data_store.get(unique_key) || null;
    if (!data) {
        return null;
    }
    return data.get(key) || null;
};