import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute as stencilBufferObjectAcquireObjectUseCase } from "./StencilBufferObjectAcquireObjectUseCase";
import { $gl } from "../../WebGLUtil";

/**
 * @description StencilBufferObjectを利用できる状態にして、返却します。
 *              Make the StencilBufferObject available and return it.
 *
 * @param  {number} width
 * @param  {number} height
 * @return {IStencilBufferObject}
 * @method
 * @protected
 */
export const execute = (width: number, height: number): IStencilBufferObject =>
{
    const stencilBufferObject = stencilBufferObjectAcquireObjectUseCase(width, height);

    if (stencilBufferObject.width !== width
        || stencilBufferObject.height !== height
    ) {
        // update
        stencilBufferObject.width  = width;
        stencilBufferObject.height = height;
        stencilBufferObject.area   = width * height;
        stencilBufferObject.dirty  = false;

        // bind
        $gl.bindRenderbuffer($gl.RENDERBUFFER, stencilBufferObject.resource);
        $gl.renderbufferStorage(
            $gl.RENDERBUFFER,
            $gl.STENCIL_INDEX8,
            width, height
        );
    }

    return stencilBufferObject;
};