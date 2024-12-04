import { $player } from "../../Player";
import { SoundMixer } from "@next2d/media";

/**
 * @description Playerの定期処理を停止
 *              Stop the regular processing of the Player
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($player.timerId > -1) {
        cancelAnimationFrame($player.timerId);
    }

    $player.stopFlag = true;
    $player.timerId  = -1;

    SoundMixer.stopAll();
};