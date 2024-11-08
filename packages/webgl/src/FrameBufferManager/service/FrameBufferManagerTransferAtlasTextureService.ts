import {
    $gl,
    $context
} from "../../WebGLUtil";
import {
    $atlasFrameBuffer,
    $setFramebufferBound
} from "../../FrameBufferManager";

/**
 * @description アトラステクスチャに転写します。
 *              Transfer to atlas texture.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const currentAttachmentObject = $context.currentAttachmentObject;

    const atlasAttachmentObject = $context.atlasAttachmentObject;
    $context.bind(atlasAttachmentObject);

    $gl.bindFramebuffer(
        $gl.DRAW_FRAMEBUFFER,
        $atlasFrameBuffer
    );
    $setFramebufferBound(false);

    $gl.blitFramebuffer(
        0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
        0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }
};