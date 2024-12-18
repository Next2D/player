import { $gridDataMap } from "../../Grid";
import { $fillBufferIndexes } from "../../Mesh";

/**
 * @description Gridデータを設定
 *              Set Grid data
 *
 * @param  {Float32Array | null} [grid_data=null]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (grid_data: Float32Array | null): void =>
{
    $gridDataMap.set($fillBufferIndexes.length, grid_data);
};