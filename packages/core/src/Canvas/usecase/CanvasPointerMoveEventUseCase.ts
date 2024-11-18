import { $setEvent } from "@next2d/events";
import { execute as playerHitTestUseCase } from "../../Player/usecase/PlayerHitTestUseCase";
import { execute as playerSetCurrentMousePoint } from "../../Player/service/PlayerSetCurrentMousePointService";
import { execute as playerPointerMoveEventService } from "../../Player/service/PlayerPointerMoveEventService";

/**
 * @description プレイヤーのポインタームーブイベントを処理します。
 *              Handles the player's pointer move event.
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

    $setEvent(event);
    playerSetCurrentMousePoint(event);

    // start position
    playerHitTestUseCase(event, element);

    // fixed logic
    // ポインタームーブイベントを発火
    playerPointerMoveEventService(event.pageX, event.pageY);
};