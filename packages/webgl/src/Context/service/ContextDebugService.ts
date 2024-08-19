import { $drawFrameBuffer } from "../../FrameBufferManager";
import { $gl, $context } from "../../WebGLUtil";
import { $setActiveAtlasIndex } from "../../AtlasManager";

export const execute = (): void =>
{
    const currentAttachmentObject = $context.currentAttachmentObject;

    $setActiveAtlasIndex(0);
    $context.bind($context.atlasAttachmentObject);

    const width  = $context.atlasAttachmentObject?.width;
    const height = $context.atlasAttachmentObject?.height;

    // use main Framebuffer
    $gl.bindFramebuffer(
        $gl.DRAW_FRAMEBUFFER,
        null
    );

    // execute
    $gl.blitFramebuffer(
        0, 0, width, height,
        0, 0, currentAttachmentObject?.width, currentAttachmentObject?.height,
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