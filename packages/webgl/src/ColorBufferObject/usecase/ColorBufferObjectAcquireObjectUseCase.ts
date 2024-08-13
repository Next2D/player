import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import { execute as colorBufferObjectCreateService } from "../service/ColorBufferObjectCreateService";
import { execute as colorBufferObjectMeguruBinarySearchService } from "../service/ColorBufferObjectMeguruBinarySearchService";

/**
 * @description 指定サイズのobjectがpoolにあれば再利用、なければ新規作成する
 *              If an object of the specified size is in the pool, reuse it, otherwise create a new one
 * 
 * @param  {array} object_pool
 * @param  {number} area
 * @return {object}
 * @method
 * @protected
 */
export const execute = (object_pool: IColorBufferObject[], area: number): IColorBufferObject =>
{
    if (!object_pool.length) {
        return colorBufferObjectCreateService();
    }

    const index = colorBufferObjectMeguruBinarySearchService(object_pool, area);
    if (index < object_pool.length) {
        const colorBuffer = object_pool[index];
        object_pool.splice(index, 1);
        return colorBuffer;
    }

    const colorBuffer = object_pool.shift();
    if (!colorBuffer) {
        throw new Error("the color buffer is void.");
    }

    return colorBuffer;
};