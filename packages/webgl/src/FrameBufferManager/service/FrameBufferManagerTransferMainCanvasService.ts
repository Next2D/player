import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import {
    $readFrameBuffer,
    $drawFrameBuffer
} from "../../FrameBufferManager";
import {
    $gl,
    $context
} from "../../WebGLUtil";

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
    const mainAttachmentObject = $context.$mainAttachmentObject as IAttachmentObject;
    $context.bind(mainAttachmentObject);

    // fixed logic
    $gl.bindFramebuffer($gl.READ_FRAMEBUFFER, $readFrameBuffer);

    // use main Framebuffer
    $gl.bindFramebuffer(
        $gl.DRAW_FRAMEBUFFER,
        null
    );

    const width  = mainAttachmentObject.width;
    const height = mainAttachmentObject.height;

    $gl.blitFramebuffer(
        0, 0, width, height,
        0, 0, width, height,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );

    // fixed logic
    $gl.bindFramebuffer($gl.DRAW_FRAMEBUFFER, $drawFrameBuffer);
    $gl.bindFramebuffer($gl.FRAMEBUFFER, $readFrameBuffer);
};