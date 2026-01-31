import {
    $isMaskDrawing,
    $setMaskDrawing,
    $clipLevels
} from "../../Mask";
import { $context } from "../../WebGPUUtil";

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
    }
};
