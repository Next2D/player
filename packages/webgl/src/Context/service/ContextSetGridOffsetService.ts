import { $setGridOffset } from "../../Grid";

/**
 * @description グリッドのオフセットを設定
 *              Set the grid offset.
 *
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @protected
 */
export const execute = (x: number, y: number): void =>
{
    $setGridOffset(x, y);
};