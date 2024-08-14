import { IStencilBufferObject } from "./interface/IStencilBufferObject";

/**
 * @description StencilBufferObjectの再利用のための配列のオブジェクトプール、
 *              Object pool of array for reusing StencilBufferObject
 * 
 * @type {IStencilBufferObject[]}
 * @private
 */
export const $objectPool: IStencilBufferObject[] = [];