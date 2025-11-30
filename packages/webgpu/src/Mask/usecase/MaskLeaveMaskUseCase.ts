import { execute as maskEndMaskService } from "../service/MaskEndMaskService";
import {
    $setMaskDrawing,
    $clipBounds,
    $clipLevels
} from "../../Mask";
import {
    $context,
    $poolFloat32Array4
} from "../../WebGPUUtil";

/**
 * @description マスクの終了処理
 *              End mask processing
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

    const clipLevel = currentAttachmentObject.clipLevel;
    const bounds = $clipBounds.get(clipLevel);
    
    if (bounds) {
        // レベルと描画範囲を削除
        $clipBounds.delete(clipLevel);
        $poolFloat32Array4(bounds);
    }
    
    $clipLevels.delete(clipLevel);

    // 単体のマスクであれば終了
    --currentAttachmentObject.clipLevel;
    if (!currentAttachmentObject.clipLevel) {
        currentAttachmentObject.mask = false;
        $setMaskDrawing(false);

        $clipLevels.clear();
        $clipBounds.clear();
        return;
    }

    maskEndMaskService();
};
