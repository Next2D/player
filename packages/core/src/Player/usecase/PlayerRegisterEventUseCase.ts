import { execute as playerKeyDownEventService } from "../service/PlayerKeyDownEventService";
import { execute as playerKeyUpEventService } from "../service/PlayerKeyUpEventService";
import { KeyboardEvent } from "@next2d/events";

/**
 * @description キーボードイベントを登録する
 *              Register keyboard events
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    window.addEventListener(KeyboardEvent.KEY_DOWN, playerKeyDownEventService as EventListener);
    window.addEventListener(KeyboardEvent.KEY_UP, playerKeyUpEventService as EventListener);
};