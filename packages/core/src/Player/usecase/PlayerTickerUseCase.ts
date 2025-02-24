import { $player } from "../../Player";
import { stage } from "@next2d/display";
import { Event } from "@next2d/events";
import { $cacheStore } from "@next2d/cache";
import { execute as playerRenderingPostMessageService } from "../service/PlayerRenderingPostMessageService";
import { execute as playerRemoveCachePostMessageService } from "../service/PlayerRemoveCachePostMessageService";

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

        // enter frame event
        if (stage.hasEventListener(Event.ENTER_FRAME)) {
            stage.dispatchEvent(new Event(Event.ENTER_FRAME));
        }

        // 描画情報を生成してworkerに送る
        if (stage.changed) {
            playerRenderingPostMessageService();
        }

        // タイマーにセットされたキャッシュを削除
        if ($cacheStore.$removeCache) {
            $cacheStore.removeTimerScheduledCache();
            // キャッシュ削除
            if ($cacheStore.$removeIds.length) {
                playerRemoveCachePostMessageService();
            }
        }
    }

    // next frame
    $player.timerId = requestAnimationFrame((timestamp: number): void =>
    {
        execute(timestamp);
    });
};