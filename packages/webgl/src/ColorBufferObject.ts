import type { IColorBufferObject } from "./interface/IColorBufferObject";

/**
 * @description ColorBufferObjectの再利用のための配列のオブジェクトプール、
 *              Object pool of array for reusing ColorBufferObject
 * 
 * @type {IColorBufferObject[]}
 * @private
 */
export const $objectPool: IColorBufferObject[] = [];