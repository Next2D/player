import type { Player } from "../../Player";
import { $stage } from "@next2d/display";
import { execute as playerRenderingPostMessageService } from "../service/PlayerRenderingPostMessageService";

export const execute = (player: Player, timestamp: number): void =>
{
    if (player.stopFlag) {
        return ;
    }

    const time: number = timestamp - player.startTime;
    if (time > player.fps) {
        player.startTime = timestamp - time % player.fps;

        // 定期処理
        $stage.$ticker();

        // 描画情報をworkerに送る
        if ($stage.changed) {
            playerRenderingPostMessageService();
        }

        // pointer check
    }

    // next frame
    player.timerId = requestAnimationFrame((timestamp: number): void =>
    {
        execute(player, timestamp);
    });
};