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
export const execute = (
    x_min: number, 
    y_min: number, 
    x_max: number, 
    y_max: number
): void => {

    if (!$isMaskDrawing()) {
        $setMaskDrawing(true);
        $gl.enable($gl.STENCIL_TEST);

        $context.maskBounds.xMin = x_min;
        $context.maskBounds.yMin = y_min;
        $context.maskBounds.xMax = x_max;
        $context.maskBounds.yMax = y_max;

        $gl.enable($gl.SCISSOR_TEST);
        $gl.scissor(
            x_min,
            y_min,
            Math.abs(x_max - x_min),
            Math.abs(y_max - y_min),
        );
    }

    const currentAttachmentObject = $context.currentAttachmentObject;
    if (!currentAttachmentObject) {
        return;
    }

    currentAttachmentObject.mask = true;
    currentAttachmentObject.clipLevel++;
};