import { $context } from "../RendererUtil";

/**
 * @description 背景色を更新
 *              Update background color
 *
 * @param  {number} color
 * @return {void}
 * @method
 * @protected
 */
export const execute = (color: number): void =>
{
    if (color === -1) {

        $context.updateBackgroundColor(1,1,1,1);

    } else {

        $context.updateBackgroundColor(
            (color & 0x00ff0000) >> 16 / 255,
            (color & 0x0000ff00) >> 8 / 255,
            color & 0x000000ff / 255,
            1
        );

    }
};