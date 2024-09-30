import { $setGridData } from "../../Grid";

/**
 * @description グリッドデータをせットします。
 *              Set the grid data.
 *
 * @param {Float32Array} grid_data
 * @return {void}
 * @method
 * @protected
 */
export const execute = (grid_data: Float32Array): void =>
{
    $setGridData(grid_data);
};