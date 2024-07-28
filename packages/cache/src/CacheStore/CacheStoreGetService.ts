/**
 * @description 指定のキーからデータを取得
 *              Get data from the specified key
 *
 * @param {Map} data_store
 * @param {array} keys
 * @return {*}
 * @method
* @public
*/
export const execute = (
    data_store: Map<string, Map<string, any>>,
    keys: string[]
): any => {

    const id: string = keys[0];
    if (!data_store.has(id)) {
        return null;
    }

    const type: string = keys[1];
    const data = data_store.get(id) as NonNullable<Map<string, any>>;
    if (!data.has(type)) {
        return null;
    }

    return data.get(type);
};