import type { Player } from "../Player";
import { execute as playerResizeEventService } from "./PlayerResizeEventService";

/**
 * @type {number}
 * @private
 */
let timerId: number = -1;

/**
 * @description 画面リサイズのイベントを登録
 *              Register screen resize event
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (player: Player): void =>
{
    window.addEventListener("resize", (): void =>
    {
        cancelAnimationFrame(timerId);
        timerId = requestAnimationFrame((): void =>
        {
            playerResizeEventService(player);
        });
    });
};