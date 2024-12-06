import { $player } from "../../Player";
import { stage } from "@next2d/display";
import { Event } from "@next2d/events";
import { execute as playerRenderingPostMessageService } from "../service/PlayerRenderingPostMessageService";
import { execute as playerRemoveCachePostMessageService } from "../service/PlayerRemoveCachePostMessageService";
import { execute as playerHitTestUseCase } from "../usecase/PlayerHitTestUseCase";

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

    const time = timestamp - $player.startTime;
    if (time > $player.fps) {

        $player.startTime = timestamp - time % $player.fps;

        // 定期処理
        stage.$ticker();

        // enter frame event
        if (stage.hasEventListener(Event.ENTER_FRAME)) {
            stage.dispatchEvent(new Event(Event.ENTER_FRAME));
        }

        // キャッシュを削除する
        if (stage.$remoceCacheKeys.length) {
            playerRemoveCachePostMessageService();
        }

        // 描画情報をworkerに送る
        if (stage.changed) {
            playerRenderingPostMessageService();
        }

        // pointer check
        playerHitTestUseCase();
    }

    // next frame
    $player.timerId = requestAnimationFrame((timestamp: number): void =>
    {
        execute(timestamp);
    });
};