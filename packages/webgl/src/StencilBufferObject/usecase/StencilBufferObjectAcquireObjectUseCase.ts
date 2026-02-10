import { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { $objectPool } from "../../StencilBufferObject";
import { execute as stencilBufferObjectCreateService } from "../service/StencilBufferObjectCreateService";

/**
 * @description オブジェクトプールにStencilBufferObjectがあれば再利用、なければ新規作成して返却します。
 *              If there is a StencilBufferObject in the object pool, it will be reused,
 *              otherwise it will be created and returned.
 *
 * @param  {number} width
 * @param  {number} height
 * @return {IStencilBufferObject}
 * @method
 * @protected
 */
export const execute = (width: number, height: number): IStencilBufferObject =>
{
    if (!$objectPool.length) {
        return stencilBufferObjectCreateService();
    }

    let bestIdx = -1;
    let bestArea = Infinity;

    for (let idx = 0; idx < $objectPool.length; ++idx) {
        const obj = $objectPool[idx];
        if (obj.width >= width && obj.height >= height) {
            if (obj.area < bestArea) {
                bestArea = obj.area;
                bestIdx = idx;
            }
        }
    }

    if (bestIdx !== -1) {
        const obj = $objectPool[bestIdx];
        $objectPool[bestIdx] = $objectPool[$objectPool.length - 1];
        $objectPool.pop();
        return obj;
    }

    return $objectPool.pop() as NonNullable<IStencilBufferObject>;
};