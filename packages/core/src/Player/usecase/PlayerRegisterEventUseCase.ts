import { execute as playerKeyDownEventService } from "../service/PlayerKeyDownEventService";
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
    window.addEventListener(KeyboardEvent.KEY_DOWN, playerKeyDownEventService);
    window.addEventListener("keyUp", () =>
    {
        console.log("keyUp");
    });
};