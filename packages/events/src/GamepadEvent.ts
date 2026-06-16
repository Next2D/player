import { Event } from "./Event";

/**
 * @description ゲームパッドによるユーザーの操作を示します。
 *              Indicates user operation via gamepad.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class GamepadEvent extends Event
{
    /**
     * @description ゲームパッドのインデックス番号
     *              Index number of the gamepad
     *
     * @type {number}
     * @default 0
     * @public
     */
    public gamepadIndex: number;

    /**
     * @description ボタンイベント時のボタン番号
     *              Button number at the time of button event
     *
     * @type {number | undefined}
     * @default undefined
     * @public
     */
    public buttonIndex: number | undefined;

    /**
     * @description ボタンの押し具合 (0.0〜1.0)
     *              The degree of button press (0.0 to 1.0)
     *
     * @type {number | undefined}
     * @default undefined
     * @public
     */
    public buttonValue: number | undefined;

    /**
     * @description 軸イベント時の軸番号
     *              Axis number at the time of axis event
     *
     * @type {number | undefined}
     * @default undefined
     * @public
     */
    public axisIndex: number | undefined;

    /**
     * @description 軸の値 (-1.0〜1.0)
     *              Axis value (-1.0 to 1.0)
     *
     * @type {number | undefined}
     * @default undefined
     * @public
     */
    public axisValue: number | undefined;

    /**
     * @param {string}  type
     * @param {boolean} [bubbles=true]
     *
     * @constructor
     * @public
     */
    constructor (type: string, bubbles: boolean = true)
    {
        super(type, bubbles);

        this.gamepadIndex = 0;
        this.buttonIndex  = undefined;
        this.buttonValue  = undefined;
        this.axisIndex    = undefined;
        this.axisValue    = undefined;
    }

    /**
     * @description ゲームパッドが接続されたときに発生します。
     *              Occurs when a gamepad is connected.
     *
     * @return {string}
     * @const
     * @static
     */
    static get GAMEPAD_CONNECTED (): string
    {
        return "gamepadconnected";
    }

    /**
     * @description ゲームパッドが切断されたときに発生します。
     *              Occurs when a gamepad is disconnected.
     *
     * @return {string}
     * @const
     * @static
     */
    static get GAMEPAD_DISCONNECTED (): string
    {
        return "gamepaddisconnected";
    }

    /**
     * @description ゲームパッドのボタンが押されたときに発生します。
     *              Occurs when a gamepad button is pressed.
     *
     * @return {string}
     * @const
     * @static
     */
    static get BUTTON_DOWN (): string
    {
        return "gamepadbuttondown";
    }

    /**
     * @description ゲームパッドのボタンが離されたときに発生します。
     *              Occurs when a gamepad button is released.
     *
     * @return {string}
     * @const
     * @static
     */
    static get BUTTON_UP (): string
    {
        return "gamepadbuttonup";
    }

    /**
     * @description ゲームパッドのスティック（軸）が変化したときに発生します。
     *              Occurs when a gamepad stick (axis) changes.
     *
     * @return {string}
     * @const
     * @static
     */
    static get AXES_MOTION (): string
    {
        return "gamepadaxesmotion";
    }
}
