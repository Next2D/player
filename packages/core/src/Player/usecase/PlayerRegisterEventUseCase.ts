import { execute as playerKeyDownEventService } from "../service/PlayerKeyDownEventService";
import { execute as playerKeyUpEventService } from "../service/PlayerKeyUpEventService";
import { execute as playerGamepadConnectService } from "../service/PlayerGamepadConnectService";
import { execute as playerGamepadDisconnectService } from "../service/PlayerGamepadDisconnectService";
import { KeyboardEvent, GamepadEvent } from "@next2d/events";

/**
 * @description キーボード・ゲームパッドイベントを登録する
 *              Register keyboard and gamepad events
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    window.addEventListener(KeyboardEvent.KEY_DOWN, playerKeyDownEventService as EventListener);
    window.addEventListener(KeyboardEvent.KEY_UP, playerKeyUpEventService as EventListener);
    window.addEventListener(GamepadEvent.GAMEPAD_CONNECTED, playerGamepadConnectService as EventListener);
    window.addEventListener(GamepadEvent.GAMEPAD_DISCONNECTED, playerGamepadDisconnectService as EventListener);
};