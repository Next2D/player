import type { IIndexRange } from "./interface/IIndexRange";

/**
 * @description IIndexRangeの再利用のための配列のオブジェクトプール、
 *              Object pool of array for reusing IIndexRange
 * 
 * @type {IIndexRange[]}
 * @private
 */
export const $objectPool: IIndexRange[] = [];