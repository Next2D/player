import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { $objectPool } from "../../StencilBufferObject";
import { $gl } from "../../WebGLUtil";

/**
 * @description StencilBufferObjectをオブジェクトプールに保管、サイズオーバー時は削除します。
 *              Stores the StencilBufferObject in the object pool and deletes it if it exceeds the size.
 * 
 * @param  {IStencilBufferObject} stencil_bffer_object 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (stencil_bffer_object: IStencilBufferObject): void =>
{
    // プールに10個以上ある場合は削除
    if ($objectPool.length > 10) {
        $gl.deleteRenderbuffer(stencil_bffer_object.resource);
        return;
    }

    stencil_bffer_object.dirty = true;
    $objectPool.push(stencil_bffer_object);
};