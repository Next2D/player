import { stage } from "@next2d/display";
import { $player } from "../../Player";
import { execute as playerRenderingPostMessageService } from "../service/PlayerRenderingPostMessageService";

/**
 * @description Playerの起動準備完了時のユースーケース
 *              Use case when Player is ready to start
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    // stage complete
    stage.ready = true;

    // postMessage
    playerRenderingPostMessageService();
    stage.changed = false;

    // run player
    $player.play();
};