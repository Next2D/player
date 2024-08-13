import type { IColorBufferObject } from "../../interface/IColorBufferObject";

/**
 * @description めぐる式二分探索法でobject_poolを検索する
 *              Search object_pool with Meguru binary search method
 * 
 * @param  {array} object_pool
 * @param  {number} area
 * @return {number}
 * @method
 * @protected
 */
export const execute = (object_pool: IColorBufferObject[], area: number): number =>
{
    let ng: number = -1;
    let ok: number = object_pool.length;

    while (Math.abs(ok - ng) > 1) {
        const mid: number = Math.floor((ok + ng) / 2);
        if (area <= object_pool[mid].area) {
            ok = mid;
        } else {
            ng = mid;
        }
    }

    return ok;
};