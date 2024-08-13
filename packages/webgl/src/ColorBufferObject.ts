import type { IColorBufferObject } from "./interface/IColorBufferObject";
import { execute as colorBufferObjectMeguruBinarySearchService } from "./ColorBufferObject/service/ColorBufferObjectMeguruBinarySearchService";
import { execute as colorBufferObjectGetColorBufferObjectUseCase } from "./ColorBufferObject/usecase/ColorBufferObjectGetColorBufferObjectUseCase";

/**
 * @description ColorBufferObjectの再利用のための配列のオブジェクトプール、
 *              Object pool of array for reusing ColorBufferObject
 * 
 * @type {IColorBufferObject[]}
 * @private
 */
const $objectPool: IColorBufferObject[] = [];

/**
 * @description 指定サイズのColorBufferObjectを取得する
 *              Get ColorBufferObject of specified size
 *
 * @param  {number} width
 * @param  {number} height
 * @return {IColorBufferObject}
 * @method
 * @public
 */
export const getColorBufferObject = (width: number, height: number): IColorBufferObject =>
{
    return colorBufferObjectGetColorBufferObjectUseCase($objectPool, width, height);
};

/**
 * @description 不要になったColorBufferObjectをプールに保管する
 *              Store the ColorBufferObject that is no longer needed in the pool
 *
 * @param  {object} color_buffer_object
 * @return {void}
 * @method
 * @public
 */
export const releaseColorBufferObject = (color_buffer_object: IColorBufferObject): void =>
{
    const index = colorBufferObjectMeguruBinarySearchService($objectPool, color_buffer_object.area);
    $objectPool.splice(index, 0, color_buffer_object);
};