import {
    $isMaskDrawing,
    $setMaskDrawing,
    $clipLevels
} from "../../Mask";
import { $context } from "../../WebGPUUtil";
import { isDebugEnabled, logMask } from "../../Debug/DebugLogger";

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
        if (isDebugEnabled()) {
            logMask("MaskBeginMaskService execute", {
                "isMaskDrawing": false,
                "isMaskTestEnabled": false
            });
            console.warn("[WebGPU Mask] No currentAttachmentObject!");
        }
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

    // デバッグ出力
    if (isDebugEnabled()) {
        logMask("MaskBeginMaskService execute", {
            "clipLevel": currentAttachmentObject.clipLevel,
            "isMaskDrawing": true,
            "isMaskTestEnabled": false
        });
    }
};
