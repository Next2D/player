import type { Graphics } from "../../Graphics";
import { execute as graphicsCalcFillBoundsService } from "../service/GraphicsCalcFillBoundsService";
import { execute as graphicsCalcLineBoundsService } from "../service/GraphicsCalcLineBoundsService";

/**
 * @description 描画範囲のバウンディングボックスを計算
 *              Calculate the bounding box of the drawing range
 * 
 * @param  {Graphics} graphics
 * @param  {boolean} has_line_enabled
 * @param  {number} position_x
 * @param  {number} position_y
 * @param  {number} line_width
 * @param  {string} caps
 * @param  {number[]} args
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    graphics: Graphics, 
    has_line_enabled: boolean,
    position_x: number = 0, position_y: number = 0,
    line_width: number = 0, caps: string = "none",
    ...args: number[]
): void => {

    for (let idx = 0; idx < args.length;) {
        const x = args[idx++];
        const y = args[idx++];

        graphicsCalcFillBoundsService(graphics, x, y);

        if (has_line_enabled) {
            graphicsCalcLineBoundsService(
                graphics, x, y,
                position_x, position_y,
                line_width, caps
            );
        }
    }
};