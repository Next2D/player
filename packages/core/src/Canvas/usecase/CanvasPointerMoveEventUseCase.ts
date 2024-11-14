import { $setEvent } from "@next2d/events";
import { execute as playerHitTestUseCase } from "../../Player/usecase/PlayerHitTestUseCase";
import { execute as playerSetCurrentMousePoint } from "../../Player/service/PlayerSetCurrentMousePoint";

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
    $setEvent(event);
    playerSetCurrentMousePoint(event);

    // start position
    playerHitTestUseCase(event);
};