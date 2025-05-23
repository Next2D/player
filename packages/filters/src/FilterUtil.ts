import type { IBitmapFilterType } from "./interface/IBitmapFilterType";

/**
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
 * @type {number}
 * @private
 */
export const $Deg2Rad: number = Math.PI / 180;

/**
 * @description 種類を数値に変換
 *              Convert type to number
 *
 * @param {IBitmapFilterType} type
 * @return {number}
 * @method
 * @protected
 */
export const $typeToNumber = (type: IBitmapFilterType): number =>
{
    switch (type) {

        case "full":
            return 0;

        case "inner":
            return 1;

        case "outer":
            return 2;

        default:
            return 0;

    }
};