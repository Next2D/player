import type { IRGBA } from "./interface/IRGBA";
import type { IElementPosition } from "./interface/IElementPosition";
import type { TextField } from "./TextField";

/**
 * @description 選択中のテキストフィールド
 *              Selected text field
 *
 * @type {TextField | null}
 * @private
 */
let $selectedTextField: TextField | null = null;

/**
 * @description 選択したテキストフィールドをセット
 *              Set the selected text field
 *
 * @param {TextField | null} text_field
 * @method
 * @public
 */
export const $setSelectedTextField = (text_field: TextField | null): void =>
{
    $selectedTextField = text_field;
};

/**
 * @description 選択中のテキストフィールドを返却
 *              Returns the selected text field
 *
 * @return {TextField | null}
 * @method
 * @public
 */
export const $getSelectedTextField = (): TextField | null =>
{
    return $selectedTextField;
};

/**
 * @description テキスト変更用の TextArea Element(hidden)
 *              TextArea Element(hidden) for changing text
 *
 * @type {HTMLTextAreaElement}
 * @protected
 */
export const $textArea: HTMLTextAreaElement = document.createElement("textarea") as HTMLTextAreaElement;

$textArea.tabIndex = -1;

let style = "";
style += "position: fixed;";
style += "top: 0;";
style += "left: 0;";
style += "font-size: 16px;";
style += "border: 0;";
style += "resize: none;";
style += "opacity: 0;";
style += "z-index: -1;";
style += "pointer-events: none;";
$textArea.setAttribute("style", style);

/**
 * @type {HTMLCanvasElement}
 * @private
*/
const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.width = canvas.height = 1;
export const $context = canvas.getContext("2d") as CanvasRenderingContext2D;

/**
 * @type {number}
 * @private
 */
let $currentWidth: number = 0;

/**
 * @description 分解中のテキストの現在の幅を取得
 *              Get the current width of the text being decomposed
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getCurrentWidth = (): number =>
{
    return $currentWidth;
};

/**
 * @description 分解中のテキストの現在の幅をセット
 *              Set the current width of the text being decomposed
 *
 * @return {void}
 * @method
 * @protected
 */
export const $setCurrentWidth = (width: number): void =>
{
    $currentWidth = width;
};

/**
 * @description カラー文字列を数値に変換
 *              Convert color string to number
 *
 * @param  {string} value
 * @return {number}
 * @method
 * @protected
 */
export const $convertColorStringToNumber = (value: string): number =>
{
    if (!$context) {
        return 0;
    }

    $context.fillStyle = value;
    return +`0x${$context.fillStyle.slice(1)}`;
};

/**
 * @description カラー文字列を数値に変換
 *              Convert color string to number
 *
 * @param  {*} value
 * @return {number}
 * @method
 * @static
 */
export const $toColorInt = (value: any): number =>
{
    return isNaN(+value)
        ? $convertColorStringToNumber(`${value}`)
        : +value;
};

/**
 * @param   {number} color
 * @param   {number} [alpha=1]
 * @returns {IRGBA}
 * @method
 * @static
 */
export const $intToRGBA = (color: number, alpha: number = 1): IRGBA =>
{
    return {
        "R": (color & 0xff0000) >> 16,
        "G": (color & 0x00ff00) >> 8,
        "B": color & 0x0000ff,
        "A": alpha * 255
    };
};

/**
 * @description 値が最小値と最大値の間に収まるように調整します。
 *              Adjust the value so that it falls between the minimum and maximum values.
 *
 * @param  {number} value
 * @param  {number} min
 * @param  {number} max
 * @param  {number} [default_value=null]
 * @return {number}
 * @method
 * @protected
 */
export const $clamp = (
    value: number,
    min: number,
    max: number,
    default_value: number | null = null
): number => {

    const number: number = +value;

    return isNaN(number) && default_value !== null
        ? default_value
        : Math.min(Math.max(min, isNaN(number) ? 0 : number), max);
};

/**
 * @type {NodeJS.Timeout}
 * @private
 */
let $timerId: NodeJS.Timeout | void;

/**
 * @description テキスト点滅のタイマーIDを返却
 *              Returns the timer ID for text blinking
 *
 * @return {NodeJS.Timeout}
 * @protected
 */
export const $getBlinkingTimerId = (): NodeJS.Timeout | void =>
{
    return $timerId;
};

/**
 * @description テキスト点滅のタイマーIDをセット
 *              Set the timer ID for text blinking
 *
 * @param  {NodeJS.Timeout} timer_id
 * @return {void}
 * @protected
 */
export const $setBlinkingTimerId = (timer_id: NodeJS.Timeout | void): void =>
{
    $timerId = timer_id;
};

/**
 * @description canvasの位置をセット
 *              Set the position of the canvas
 *
 * @type {IElementPosition}
 * @public
 */
export const $mainCanvasPosition: IElementPosition = {
    "x": 0,
    "y": 0
};