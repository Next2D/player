import { $player } from "../../Player";
import { stage } from "@next2d/display";
import { Event } from "@next2d/events";
import { $cacheStore } from "@next2d/cache";
import { execute as playerRenderingPostMessageService } from "../service/PlayerRenderingPostMessageService";
import { execute as playerRemoveCachePostMessageService } from "../service/PlayerRemoveCachePostMessageService";
import { execute as playerGamepadTickerService } from "../service/PlayerGamepadTickerService";

/**
 * @private
 * @constant
 * @type {Event}
 */
const enterFrameEvent: Event = new Event(Event.ENTER_FRAME);

/**
 * @description Playerの定期処理
 *              Regular processing of Player
 *
 * @param  {number} timestamp
 * @return {void}
 * @method
 * @protected
 */
export const execute = (timestamp: number): void =>
{
    if ($player.stopFlag) {
        return ;
    }

    // キャッシュ削除
    if ($cacheStore.$removeIds.length) {
        playerRemoveCachePostMessageService();
    }

    const time = timestamp - $player.startTime;
    if (time > $player.fps) {

        $player.startTime = timestamp - time % $player.fps;

        // 定期処理
        stage.$ticker();

        // gamepad polling
        playerGamepadTickerService();

        // enter frame event
        if (stage.hasEventListener(Event.ENTER_FRAME)) {
            stage.dispatchEvent(enterFrameEvent);
        }

        // 描画情報を生成してworkerに送る
        if (stage.changed) {
            playerRenderingPostMessageService();
        }

        // LRU上限を超えたキャッシュを削除する。描画情報を送ったあとに行うことで、
        // worker には必ず「描画」→「削除」の順で届く(生成の途中で削除すると、
        // 作り直したキャッシュがあとから届いた削除で消えてしまう)。
        if ($cacheStore.$overLimit) {
            $cacheStore.evictOverLimit();
            if ($cacheStore.$removeIds.length) {
                playerRemoveCachePostMessageService();
            }
        }

        // タイマーにセットされたキャッシュを削除
        if ($cacheStore.$removeCache) {
            $cacheStore.removeTimerScheduledCache();
            // キャッシュ削除
            if ($cacheStore.$removeIds.length) {
                playerRemoveCachePostMessageService();
            }
        }

        // フレーム処理終了イベント
        if (stage.hasEventListener(Event.EXIT_FRAME)) {
            stage.dispatchEvent(enterFrameEvent);
        }
    }

    // next frame
    $player.timerId = requestAnimationFrame((timestamp: number): void =>
    {
        execute(timestamp);
    });
};