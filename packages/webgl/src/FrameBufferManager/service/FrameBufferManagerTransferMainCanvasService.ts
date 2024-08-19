import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { $drawFrameBuffer } from "../../FrameBufferManager";
import { $gl, $context } from "../../WebGLUtil";

/**
 * @description メインのアタッチメントオブジェクトをメインキャンバスに転送します。
 *              Transfer the main attachment object to the main canvas.
 * 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const currentAttachmentObject = $context.currentAttachmentObject;

    const mainAttachmentObject = $context.$mainAttachmentObject as IAttachmentObject;
    $context.bind(mainAttachmentObject);

    const width  = mainAttachmentObject.width;
    const height = mainAttachmentObject.height;

    // use main Framebuffer
    $gl.bindFramebuffer(
        $gl.DRAW_FRAMEBUFFER,
        null
    );

    // execute
    $gl.blitFramebuffer(
        0, 0, width, height,
        0, 0, width, height,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );

    // reset
    $gl.bindFramebuffer(
        $gl.DRAW_FRAMEBUFFER,
        $drawFrameBuffer
    );

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }  
};