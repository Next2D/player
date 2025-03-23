import {
    $isMaskDrawing,
    $setMaskDrawing,
    $clipLevels
} from "../../Mask";
import {
    $context,
    $gl
} from "../../WebGLUtil";

/**
 * @description マスク描画の開始準備
 *              Prepare to start drawing the mask
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const currentAttachmentObject = $context.currentAttachmentObject;
    if (!currentAttachmentObject) {
        return;
    }

    currentAttachmentObject.mask = true;
    currentAttachmentObject.clipLevel++;
    $clipLevels.set(
        currentAttachmentObject.clipLevel,
        currentAttachmentObject.clipLevel
    );

    if (!$isMaskDrawing()) {
        $setMaskDrawing(true);

        $gl.enable($gl.STENCIL_TEST);
        $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);

        $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
        $gl.stencilOp($gl.ZERO, $gl.INVERT, $gl.INVERT);
        $gl.colorMask(false, false, false, false);
    }
};