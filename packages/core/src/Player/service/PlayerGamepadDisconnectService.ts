import { $gamepadButtonStates, $gamepadAxisStates } from "../../GamepadState";
import { stage } from "@next2d/display";
import { GamepadEvent } from "@next2d/events";

/**
 * @description ゲームパッド切断イベントを実行する
 *              Execute the gamepad disconnected event
 *
 * @param  {GamepadEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: GamepadEvent): void =>
{
    const gamepad = event.gamepad;
    if (!gamepad) {
        return ;
    }

    $gamepadButtonStates.delete(gamepad.index);
    $gamepadAxisStates.delete(gamepad.index);

    if (!stage.hasEventListener(GamepadEvent.GAMEPAD_DISCONNECTED)) {
        return ;
    }

    const gamepadEvent = new GamepadEvent(GamepadEvent.GAMEPAD_DISCONNECTED);
    gamepadEvent.gamepadIndex = gamepad.index;
    stage.dispatchEvent(gamepadEvent);
};
