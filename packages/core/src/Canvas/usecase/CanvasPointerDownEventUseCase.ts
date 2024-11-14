import { $setEvent } from "@next2d/events";
import { $player } from "../../Player";
import { execute as playerHitTestUseCase } from "../../Player/usecase/PlayerHitTestUseCase";
import { execute as playerSetCurrentMousePoint } from "../../Player/service/PlayerSetCurrentMousePoint";

/**
 * @description プレイヤーのポインターダウンイベントを処理します。
 *              Processes the player's pointer down event.
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.target as HTMLCanvasElement;
    if (!element) {
        return ;
    }

    $player.mouseState = "down";
    element.setPointerCapture(event.pointerId);

    $setEvent(event);
    playerSetCurrentMousePoint(event);

    // start position
    playerHitTestUseCase(event, element);
};