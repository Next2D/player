import { $terminateGrid } from "../../Grid";

/**
 * @description グリッドの有効状態を解除
 *              Disable the grid.
 * 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    $terminateGrid();
};