import { $stage } from "@next2d/display";
import { $player } from "../../Player";
import { execute as playerRenderingPostMessageService } from "../service/PlayerRenderingPostMessageService";

/**
 * @description Playerの起動準備完了時のユースーケース
 *              Use case when Player is ready to start
 */
export const execute = (): void =>
{
    // stage complete
    $stage.ready = true;

    // postMessage
    playerRenderingPostMessageService();

    // run player
    $player.play();
};