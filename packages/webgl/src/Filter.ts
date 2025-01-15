import type { IPoint } from "./interface/IPoint";

/**
 * @description フィルター適用におけるオフセット値
 *             Offset value in filter application
 *
 * @type {IPoint}
 * @protected
 */
export const $offset: IPoint = {
    "x": 0,
    "y": 0
};

/**
 * @description カラー値から赤成分を取得します。
 *              Get the red component from the color value.
 *
 * @param  {number} color
 * @param  {number} alpha
 * @param  {boolean} premultiplied
 * @return {number}
 * @method
 * @protected
 */
export const $intToR = (color: number, alpha: number, premultiplied: boolean): number =>
{
    return (color >> 16) * (premultiplied ? alpha : 1) / 255;
};

/**
 * @description カラー値から緑成分を取得します。
 *              Get the green component from the color value.
 *
 * @param  {number} color
 * @param  {number} alpha
 * @param  {boolean} premultiplied
 * @return {number}
 * @method
 * @protected
 */
export const $intToG = (color: number, alpha: number, premultiplied: boolean): number =>
{
    return (color >> 8 & 0xFF) * (premultiplied ? alpha : 1) / 255;
};

/**
 * @description カラー値から青成分を取得します。
 *              Get the red component from the color value.
 *
 * @param  {number} color
 * @param  {number} alpha
 * @param  {boolean} premultiplied
 * @return {number}
 * @method
 * @protected
 */
export const $intToB = (color: number, alpha: number, premultiplied: boolean): number =>
{
    return (color & 0xFF) * (premultiplied ? alpha : 1) / 255;
};