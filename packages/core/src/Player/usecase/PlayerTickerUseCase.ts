import type { Player } from "../../Player";
import { $stage } from "@next2d/display";
import { execute as playerRenderingPostMessageService } from "../service/PlayerRenderingPostMessageService";
import { execute as playerRemoveCachePostMessageService } from "../service/PlayerRemoveCachePostMessageService";

/**
 * @description Playerの定期処理
 *              Regular processing of Player
 *
 * @param  {Player} player
 * @param  {number} timestamp
 * @return {void}
 * @method
 * @protected
 */
export const execute = (player: Player, timestamp: number): void =>
{
    if (player.stopFlag) {
        return ;
    }

    const time = timestamp - player.startTime;
    if (time > player.fps) {
        player.startTime = timestamp - time % player.fps;

        // 定期処理
        $stage.$ticker();

        if ($stage.$remoceCacheKeys.length) {
            playerRemoveCachePostMessageService();
        }

        if ($stage.changed) {
            // 描画情報をworkerに送る
            playerRenderingPostMessageService();

            // todo sound
        }

        // pointer check
    }

    // next frame
    player.timerId = requestAnimationFrame((timestamp: number): void =>
    {
        execute(player, timestamp);
    });
};