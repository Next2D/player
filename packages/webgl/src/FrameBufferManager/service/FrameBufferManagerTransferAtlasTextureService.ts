import {
    $getActiveTransferBounds,
    $activeAtlasIndex
} from "../../AtlasManager";
import {
    $gl,
    $context,
    $enableScissorTest,
    $disableScissorTest
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

    const atlasIdx = $activeAtlasIndex;
    const bounds = $getActiveTransferBounds(atlasIdx);

    $enableScissorTest();
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
    $disableScissorTest();

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    $context.newDrawState = false;
};
