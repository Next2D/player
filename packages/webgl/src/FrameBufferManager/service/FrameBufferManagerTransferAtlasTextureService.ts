import {
    $getActiveTransferBounds,
    $getActiveAtlasIndex
} from "../../AtlasManager";
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
    if (!$context.newDrawState) {
        return ;
    }

    const currentAttachmentObject = $context.currentAttachmentObject;

    const atlasAttachmentObject = $context.atlasAttachmentObject;
    $context.bind(atlasAttachmentObject);

    $gl.bindFramebuffer(
        $gl.DRAW_FRAMEBUFFER,
        $atlasFrameBuffer
    );
    $setFramebufferBound(false);

    const bounds = $getActiveTransferBounds($getActiveAtlasIndex());
    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(
        bounds[0], bounds[1],
        bounds[2] - bounds[0], bounds[3] - bounds[1]
    );

    $gl.blitFramebuffer(
        0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
        0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );
    $gl.disable($gl.SCISSOR_TEST);

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    $context.newDrawState = false;
};