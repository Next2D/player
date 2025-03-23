import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import { execute as colorBufferObjectAcquireObjectUseCase } from "./ColorBufferObjectAcquireObjectUseCase";
import {
    $gl,
    $samples,
    $upperPowerOfTwo
} from "../../WebGLUtil";

/**
 * @description 指定サイズのColorBufferObjectを取得する
 *              Get a ColorBufferObject of the specified size
 *
 * @param  {number} width
 * @param  {number} height
 * @return {object}
 * @method
 * @protected
 */
export const execute = (width: number, height: number): IColorBufferObject =>
{
    // 128以下で描画崩れが発生する場合がある？ため、256を最小サイズにする
    width  = Math.max(256, $upperPowerOfTwo(width));
    height = Math.max(256, $upperPowerOfTwo(height));

    const colorBufferObject = colorBufferObjectAcquireObjectUseCase(width * height);
    if (colorBufferObject.width < width
        || colorBufferObject.height < height
    ) {

        width  = Math.max(width, colorBufferObject.width);
        height = Math.max(height, colorBufferObject.height);

        colorBufferObject.width  = width;
        colorBufferObject.height = height;
        colorBufferObject.area   = width * height;

        $gl.bindRenderbuffer($gl.RENDERBUFFER, colorBufferObject.resource);
        $gl.renderbufferStorageMultisample(
            $gl.RENDERBUFFER,
            $samples,
            $gl.RGBA8,
            width, height
        );

        $gl.bindRenderbuffer($gl.RENDERBUFFER, colorBufferObject.stencil.resource);
        $gl.renderbufferStorageMultisample(
            $gl.RENDERBUFFER,
            $samples,
            $gl.STENCIL_INDEX8,
            width, height
        );
    }

    colorBufferObject.dirty = true;
    return colorBufferObject;
};