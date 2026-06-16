import { $gamepadButtonStates, $gamepadAxisStates } from "../../GamepadState";
import { stage } from "@next2d/display";
import { GamepadEvent } from "@next2d/events";

/**
 * @private
 * @constant
 * @type {number}
 */
const AXIS_DEAD_ZONE: number = 0.1;

/**
 * @description ゲームパッドのボタン変化を処理する
 *              Process gamepad button changes
 *
 * @param  {Gamepad} gamepad
 * @param  {boolean[]} prevButtons
 * @return {void}
 * @method
 * @private
 */
const processButtons = (gamepad: Gamepad, prevButtons: boolean[]): void =>
{
    const hasButtonDown = stage.hasEventListener(GamepadEvent.BUTTON_DOWN);
    const hasButtonUp   = stage.hasEventListener(GamepadEvent.BUTTON_UP);

    if (!hasButtonDown && !hasButtonUp) {
        return ;
    }

    for (let i = 0; i < gamepad.buttons.length; i++) {
        const pressed = gamepad.buttons[i].pressed;
        if (pressed === prevButtons[i]) {
            continue;
        }

        const type = pressed ? GamepadEvent.BUTTON_DOWN : GamepadEvent.BUTTON_UP;
        if (pressed && !hasButtonDown || !pressed && !hasButtonUp) {
            prevButtons[i] = pressed;
            continue;
        }

        const event = new GamepadEvent(type);
        event.gamepadIndex = gamepad.index;
        event.buttonIndex  = i;
        event.buttonValue  = gamepad.buttons[i].value;
        stage.dispatchEvent(event);

        prevButtons[i] = pressed;
    }
};

/**
 * @description ゲームパッドの軸変化を処理する
 *              Process gamepad axis changes
 *
 * @param  {Gamepad} gamepad
 * @param  {number[]} prevAxes
 * @return {void}
 * @method
 * @private
 */
const processAxes = (gamepad: Gamepad, prevAxes: number[]): void =>
{
    if (!stage.hasEventListener(GamepadEvent.AXES_MOTION)) {
        return ;
    }

    for (let i = 0; i < gamepad.axes.length; i++) {
        const value = gamepad.axes[i];
        if (Math.abs(value - prevAxes[i]) < AXIS_DEAD_ZONE) {
            continue;
        }

        const event = new GamepadEvent(GamepadEvent.AXES_MOTION);
        event.gamepadIndex = gamepad.index;
        event.axisIndex    = i;
        event.axisValue    = value;
        stage.dispatchEvent(event);

        prevAxes[i] = value;
    }
};

/**
 * @description ゲームパッドのポーリング処理を実行する
 *              Execute gamepad polling process
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const gamepads = navigator.getGamepads();

    for (let idx = 0; idx < gamepads.length; idx++) {
        const gamepad = gamepads[idx];
        if (!gamepad) {
            continue;
        }

        if (!$gamepadButtonStates.has(gamepad.index)) {
            $gamepadButtonStates.set(
                gamepad.index,
                Array.from({ "length": gamepad.buttons.length }, () => false)
            );
            $gamepadAxisStates.set(
                gamepad.index,
                Array.from({ "length": gamepad.axes.length }, () => 0)
            );
        }

        const prevButtons = $gamepadButtonStates.get(gamepad.index) as boolean[];
        const prevAxes    = $gamepadAxisStates.get(gamepad.index) as number[];

        processButtons(gamepad, prevButtons);
        processAxes(gamepad, prevAxes);
    }
};
