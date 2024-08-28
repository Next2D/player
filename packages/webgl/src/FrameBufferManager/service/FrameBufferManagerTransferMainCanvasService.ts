import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { $setFramebufferBound } from "../../FrameBufferManager";
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

    // use main Framebuffer
    $gl.bindFramebuffer(
        $gl.DRAW_FRAMEBUFFER,
        null
    );
    $setFramebufferBound(false);

    const width  = mainAttachmentObject.width;
    const height = mainAttachmentObject.height;

    // execute
    $gl.blitFramebuffer(
        0, 0, width, height,
        0, 0, width, height,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );
};