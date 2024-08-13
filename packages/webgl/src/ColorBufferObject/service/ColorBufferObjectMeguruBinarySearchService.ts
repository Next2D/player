import { $objectPool } from "../../ColorBufferObject";

/**
 * @description めぐる式二分探索法でobject_poolを検索する
 *              Search object_pool with Meguru binary search method
 * 
 * @param  {number} area
 * @return {number}
 * @method
 * @protected
 */
export const execute = (area: number): number =>
{
    let ng: number = -1;
    let ok: number = $objectPool.length;

    while (Math.abs(ok - ng) > 1) {
        const mid: number = Math.floor((ok + ng) / 2);
        if (area <= $objectPool[mid].area) {
            ok = mid;
        } else {
            ng = mid;
        }
    }

    return ok;
};