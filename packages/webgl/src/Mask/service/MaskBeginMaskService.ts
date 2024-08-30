import {
    $isMaskDrawing, 
    $setMaskDrawing
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

    if (!$isMaskDrawing()) {
        $setMaskDrawing(true);
        $gl.enable($gl.STENCIL_TEST);
    }
};