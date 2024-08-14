import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import { execute as colorBufferObjectMeguruBinarySearchService } from "../service/ColorBufferObjectMeguruBinarySearchService"
import { $objectPool } from "../../ColorBufferObject";

/**
 * @description 利用済みのColorBufferObjectを再利用するためにプールに保管する
 *              Store the used ColorBufferObject in the pool for reuse
 *
 * @param  {object} color_buffer_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (color_buffer_object: IColorBufferObject): void =>
{
    if ($objectPool.indexOf(color_buffer_object) > -1) {
        return ;
    }

    const index = colorBufferObjectMeguruBinarySearchService(color_buffer_object.area);
    $objectPool.splice(index, 0, color_buffer_object);
};