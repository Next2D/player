import type { Graphics } from "../../Graphics";

/**
 * @description 追加のパスを描画データに追加
 *              Add additional paths to the drawing data
 * 
 * @param  {boolean} has_fill_enabled 
 * @param  {boolean} has_line_enabled 
 * @param  {array | null} fills 
 * @param  {array | null} lines 
 * @param  {array} args 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    graphics: Graphics,
    has_fill_enabled: boolean,
    has_line_enabled: boolean,
    fills: any[] | null,
    lines: any[] | null,
    ...args: any[]
): void => {

    // 確定フラグを解除
    graphics.isConfirmed = false;

    if (has_fill_enabled && fills) {
        fills.push(...args);
    }

    if (has_line_enabled && lines) {
        lines.push(...args);
    }
};