import { $setEvent } from "@next2d/events";
import { $player } from "../../Player";
import { execute as playerHitTestUseCase } from "../../Player/usecase/PlayerHitTestUseCase";
import { execute as playerSetCurrentMousePoint } from "../../Player/service/PlayerSetCurrentMousePointService";
import { execute as playerPointerUpEventService } from "../../Player/service/PlayerPointerUpEventService";

/**
 * @description プレイヤーのポインターアップイベントを処理します。
 *              Processes the player's pointer up event.
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

    $player.mouseState = "up";
    element.releasePointerCapture(event.pointerId);

    $setEvent(event);
    playerSetCurrentMousePoint(event);

    // start position
    playerHitTestUseCase();

    // fixed logic
    // ポインターアップイベントを発火します。
    playerPointerUpEventService();
};