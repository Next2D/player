import type { CacheStore } from "../../CacheStore";
/**
 * @description 指定のキーからデータを取得
 *              Get data from the specified key
 *
 *              削除予定（trash_store 登録済み）のエントリは get 時に削除予定をキャンセルする。
 *              これにより、get 後の removeTimerScheduledCache() で
 *              内側 Map の "trash" マーク削除によりループがスキップされる問題を回避する。
 *              When entries are pending deletion (registered in trash_store), the
 *              scheduled removal is canceled here. This prevents the
 *              removeTimerScheduledCache() loop from skipping such entries due to
 *              the inner Map's "trash" marker having been deleted.
 *
 * @param  {Map} data_store
 * @param  {Map} trash_store
 * @param  {string} unique_key
 * @param  {string} key
 * @return {*}
 * @method
 * @public
 */
export const execute = (
    cache_store: CacheStore,
    data_store: Map<string, Map<string, any>>,
    trash_store: Map<string, Map<string, any>>,
    unique_key: string,
    key: string
): any => {

    const data = data_store.get(unique_key) || null;
    if (!data) {
        return null;
    }

    if (trash_store.has(unique_key)) {
        trash_store.delete(unique_key);
        data.delete("trash");
    }

    // LRU: 上限が設定されている場合、参照したIDを最新に更新する
    if (cache_store.$maxStoreSize > 0) {
        data_store.delete(unique_key);
        data_store.set(unique_key, data);
    }

    return data.get(key) || null;
};
