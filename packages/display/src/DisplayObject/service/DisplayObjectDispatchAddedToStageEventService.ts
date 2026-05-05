import type { DisplayObject } from "../../DisplayObject";
import { Event } from "@next2d/events";
import { $stageAssignedMap } from "../../DisplayObjectUtil";
import { $cacheStore } from "@next2d/cache";

/**
 * @description DisplayObjectのADDED_TO_STAGEイベントを実行
 *              Execute the ADDED_TO_STAGE event of DisplayObject
 *
 * @param  {DisplayObject} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(display_object: D): void =>
{
    if (display_object.$addedToStage
        || !$stageAssignedMap.has(display_object.instanceId)
    ) {
        return ;
    }

    // 一旦ステージから外れて削除タイマーに乗ったインスタンスがそのまま再復帰した場合、
    // 1秒後の wipe で巻き添えにならないよう trash 登録を取り消す。
    // ナビゲーション（毎回新インスタンス生成）では trash に該当 id がないため no-op。
    if (display_object.uniqueKey) {
        $cacheStore.cancelRemoveTimer(display_object.uniqueKey);
    }
    $cacheStore.cancelRemoveTimer(`${display_object.instanceId}`);

    display_object.$addedToStage = true;
    if (display_object.willTrigger(Event.ADDED_TO_STAGE)) {
        display_object.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
    }
};