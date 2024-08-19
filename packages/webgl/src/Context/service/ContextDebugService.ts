import { $drawFrameBuffer } from "../../FrameBufferManager";
import { $gl, $context } from "../../WebGLUtil";

export const execute = (): void =>
{
    const currentAttachmentObject = $context.currentAttachmentObject;
    $context.bind($context.atlasAttachmentObject);

    const width  = $context.currentAttachmentObject?.width;
    const height = $context.currentAttachmentObject?.height;

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