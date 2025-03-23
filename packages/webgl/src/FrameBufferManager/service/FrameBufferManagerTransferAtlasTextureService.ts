import {
    $getActiveTransferBounds,
    $getActiveAtlasIndex,
    $getActiveAllTransferBounds
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
 * @type {number}
 * @private
 */
let $currentIndex: number = 0;

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

    if ($currentIndex === $getActiveAtlasIndex()) {
        const bounds = $getActiveTransferBounds($getActiveAtlasIndex());
        if (bounds[2] !== -Number.MAX_VALUE
            && bounds[3] !== -Number.MAX_VALUE
        ) {
            $gl.enable($gl.SCISSOR_TEST);
            $gl.scissor(
                bounds[0], bounds[1],
                bounds[2], bounds[3]
            );

            $gl.blitFramebuffer(
                0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
                0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
                $gl.COLOR_BUFFER_BIT,
                $gl.NEAREST
            );
            $gl.disable($gl.SCISSOR_TEST);
        }
    } else {
        const bounds = $getActiveAllTransferBounds($getActiveAtlasIndex());

        $gl.enable($gl.SCISSOR_TEST);
        $gl.scissor(
            bounds[0], bounds[1],
            bounds[2], bounds[3]
        );

        $gl.blitFramebuffer(
            0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
            0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
            $gl.COLOR_BUFFER_BIT,
            $gl.NEAREST
        );
        $gl.disable($gl.SCISSOR_TEST);

        $currentIndex = $getActiveAtlasIndex();
    }

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }
};