import { $player } from "../../Player";
import { $setEvent } from "@next2d/display";
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
    const element: HTMLElement = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    element.setPointerCapture(event.pointerId);

    // イベントの伝播を止める
    event.preventDefault();
    event.stopPropagation();

    $setEvent(event);
    playerSetCurrentMousePoint(event);

    // start position
    playerHitTestUseCase($player, event);
};