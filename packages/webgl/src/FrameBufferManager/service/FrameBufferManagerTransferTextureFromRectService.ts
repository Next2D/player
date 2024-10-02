import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import {
    $readFrameBuffer,
    $getReadBitmapFrameBuffer,
    $getDrawBitmapFrameBuffer
} from "../../FrameBufferManager";
import {
    $gl,
    $context
} from "../../WebGLUtil";

/**
 * @description メインのアタッチメントオブジェクトをメインキャンバスに転送します。
 *              Transfer the main attachment object to the main canvas.
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {ITextureObject} texture_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (x: number, y: number, texture_object: ITextureObject): void =>
{
    const readBitmapFrameBuffer = $getReadBitmapFrameBuffer();
    $gl.bindFramebuffer($gl.FRAMEBUFFER, readBitmapFrameBuffer);
    $gl.framebufferTexture2D(
        $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
        $gl.TEXTURE_2D, texture_object.resource, 0
    );

    const drawBitmapFrameBuffer = $getDrawBitmapFrameBuffer();
    $gl.bindFramebuffer($gl.FRAMEBUFFER, drawBitmapFrameBuffer);

    const currentAttachmentObject = $context.currentAttachmentObject as IAttachmentObject;
    $gl.framebufferTexture2D(
        $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
        $gl.TEXTURE_2D, (currentAttachmentObject.texture as ITextureObject).resource, 0
    );
    
    $gl.bindFramebuffer($gl.FRAMEBUFFER, null);
    $gl.bindFramebuffer($gl.READ_FRAMEBUFFER, readBitmapFrameBuffer);
    $gl.bindFramebuffer($gl.DRAW_FRAMEBUFFER, drawBitmapFrameBuffer);

    // execute
    $gl.blitFramebuffer(
        0, 0, texture_object.width, texture_object.height,
        x, y, x + texture_object.width, y + texture_object.height,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );

    // reset
    $gl.bindFramebuffer($gl.FRAMEBUFFER, $readFrameBuffer);
    $gl.bindFramebuffer($gl.READ_FRAMEBUFFER, $readFrameBuffer);
};