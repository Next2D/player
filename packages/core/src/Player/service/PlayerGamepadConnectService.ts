import { $gamepadButtonStates, $gamepadAxisStates } from "../../GamepadState";
import { stage } from "@next2d/display";
import { GamepadEvent } from "@next2d/events";

/**
 * @description ゲームパッド接続イベントを実行する
 *              Execute the gamepad connected event
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

    $gamepadButtonStates.set(
        gamepad.index,
        Array.from({ "length": gamepad.buttons.length }, () => false)
    );
    $gamepadAxisStates.set(
        gamepad.index,
        Array.from({ "length": gamepad.axes.length }, () => 0)
    );

    if (!stage.hasEventListener(GamepadEvent.GAMEPAD_CONNECTED)) {
        return ;
    }

    const gamepadEvent = new GamepadEvent(GamepadEvent.GAMEPAD_CONNECTED);
    gamepadEvent.gamepadIndex = gamepad.index;
    stage.dispatchEvent(gamepadEvent);
};
