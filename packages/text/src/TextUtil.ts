import type { IRGBA } from "./interface/IRGBA";

const canvas = document.createElement("canvas");
canvas.width = canvas.height = 1;
const colorContext = canvas.getContext("2d");

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
    if (!colorContext) {
        return 0;
    }

    colorContext.fillStyle = value;
    return +`0x${colorContext.fillStyle.slice(1)}`;
};

/**
 * @description カラー文字列を数値に変換
 *              Convert color string to number
 * 
 * @param  {number|string} value
 * @return {number}
 * @method
 * @static
 */
export const $toColorInt = (value: number | string): number =>
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