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

    for (let idx: number = 0; idx < $objectPool.length; ++idx) {

        const stencilBufferObject = $objectPool[idx];
        if (stencilBufferObject.width === width
            && stencilBufferObject.height === height
        ) {
            $objectPool.splice(idx, 1);
            return stencilBufferObject;
        }
    }

    return $objectPool.shift() as NonNullable<IStencilBufferObject>;
};