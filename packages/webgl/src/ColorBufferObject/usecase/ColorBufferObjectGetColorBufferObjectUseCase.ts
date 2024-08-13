import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import { execute as colorBufferObjectAcquireObjectUseCase } from "./ColorBufferObjectAcquireObjectUseCase";
import {
    $gl,
    $samples,
    $upperPowerOfTwo
} from "../../WebGLUtil";

export const execute = (object_pool: IColorBufferObject[], width: number, height: number): IColorBufferObject =>
{
    // 128以下で描画崩れが発生する場合がある？ため、256を最小サイズにする
    width  = Math.max(256, $upperPowerOfTwo(width));
    height = Math.max(256, $upperPowerOfTwo(height));

    const colorBufferObject = colorBufferObjectAcquireObjectUseCase(object_pool, width * height);
    if (colorBufferObject.width < width
        || colorBufferObject.height < height
    ) {

        width  = Math.max(width, colorBufferObject.width);
        height = Math.max(height, colorBufferObject.height);

        colorBufferObject.width  = width;
        colorBufferObject.height = height;
        colorBufferObject.area   = width * height;

        $gl.bindRenderbuffer($gl.RENDERBUFFER, colorBufferObject.colorRenderbuffer);
        $gl.renderbufferStorageMultisample(
            $gl.RENDERBUFFER,
            $samples,
            $gl.RGBA8,
            width, height
        );

        $gl.bindRenderbuffer($gl.RENDERBUFFER, colorBufferObject.stencilRenderbuffer);
        $gl.renderbufferStorageMultisample(
            $gl.RENDERBUFFER,
            $samples,
            $gl.STENCIL_INDEX8,
            width, height
        );
    }

    return colorBufferObject;
};