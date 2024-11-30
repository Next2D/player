import { $setEvent } from "@next2d/events";
import { $player } from "../../Player";
import { execute as playerHitTestUseCase } from "../../Player/usecase/PlayerHitTestUseCase";
import { execute as playerSetCurrentMousePointService } from "../../Player/service/PlayerSetCurrentMousePointService";
import { execute as playerPointerDownEventService } from "../../Player/service/PlayerPointerDownEventService";
import { execute as playerDoubleClickEventService } from "../../Player/service/PlayerDoubleClickEventService";
import { $hitObject } from "../../CoreUtil";

/**
 * @type {NodeJS.Timeout}
 * @private
 */
let $timerId: NodeJS.Timeout;

/**
 * @type {boolean}
 * @private
 */
let $wait: boolean = false;

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
    playerSetCurrentMousePointService(event);

    // start position
    playerHitTestUseCase(event, element);

    if ($hitObject.hit) {
        event.preventDefault();
    }

    // fixed logic
    clearTimeout($timerId);

    if (!$wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        $wait = true;

        // ダブルタップ有効期限をセット
        $timerId = setTimeout((): void =>
        {
            $wait = false;
        }, 300);

        playerPointerDownEventService();

    } else {

        // ダブルタップを終了
        $wait = false;

        playerDoubleClickEventService();

    }
};