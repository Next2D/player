import { $player } from "../../Player";
import { stage } from "@next2d/display";
import { execute as playerTickerUseCase } from "./PlayerTickerUseCase";

/**
 * @description Playerの再生を開始
 *              Start playing the Player
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if (!$player.stopFlag) {
        return ;
    }

    $player.stopFlag = false;
    stage.changed = true;

    if ($player.timerId > -1) {
        cancelAnimationFrame($player.timerId);
    }

    $player.fps = 1000 / stage.frameRate | 0;

    $player.startTime = performance.now();
    $player.timerId = requestAnimationFrame((timestamp: number): void =>
    {
        playerTickerUseCase(timestamp);
    });
};