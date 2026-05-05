/**
 * @description 指定IDの削除タイマー登録を取り消す
 *              Cancel the deletion timer registration for the specified ID
 *
 *              削除タイマー（trash_store）に登録済みのエントリを再利用する場合に呼ぶ。
 *              これにより、1秒後の removeTimerScheduledCache() による wipe を防ぐ。
 *              主にステージから一旦外れたインスタンスが addedToStage で再復帰した際の
 *              キャッシュ復活経路として使用する。
 *              When reusing an entry that has been registered for removal in the trash_store,
 *              this is called to prevent the wipe by removeTimerScheduledCache() after 1 second.
 *
 * @param  {Map} data_store
 * @param  {Map} trash_store
 * @param  {string} id
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    data_store: Map<string, Map<string, any>>,
    trash_store: Map<string, Map<string, any>>,
    id: string
): void => {

    if (!trash_store.has(id)) {
        return ;
    }

    trash_store.delete(id);

    const data = data_store.get(id);
    if (data) {
        data.delete("trash");
    }
};
