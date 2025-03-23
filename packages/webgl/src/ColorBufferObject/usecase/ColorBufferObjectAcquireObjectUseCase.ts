import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import { execute as colorBufferObjectCreateService } from "../service/ColorBufferObjectCreateService";
import { execute as colorBufferObjectMeguruBinarySearchService } from "../service/ColorBufferObjectMeguruBinarySearchService";
import { $objectPool } from "../../ColorBufferObject";

/**
 * @description 指定サイズのobjectがpoolにあれば再利用、なければ新規作成する
 *              If an object of the specified size is in the pool, reuse it, otherwise create a new one
 *
 * @param  {number} area
 * @return {object}
 * @method
 * @protected
 */
export const execute = (area: number): IColorBufferObject =>
{
    if (!$objectPool.length) {
        return colorBufferObjectCreateService();
    }

    const index = colorBufferObjectMeguruBinarySearchService(area);
    if (index < $objectPool.length) {
        const colorBuffer = $objectPool[index];
        $objectPool.splice(index, 1);
        return colorBuffer;
    }

    const colorBuffer = $objectPool.shift();
    if (!colorBuffer) {
        throw new Error("the color buffer is void.");
    }

    return colorBuffer;
};