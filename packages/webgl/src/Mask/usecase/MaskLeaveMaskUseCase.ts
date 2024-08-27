import { $setMaskDrawing } from "../../Mask";
import { execute as maskClearRectService } from "../../Mask/service/MaskClearRectService";
import {
    $gl,
    $context
} from "../../WebGLUtil";

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
        return ;
    }

    --currentAttachmentObject.clipLevel;
    currentAttachmentObject.mask = !!currentAttachmentObject.clipLevel;

    if (!currentAttachmentObject.clipLevel) {
        maskClearRectService();

        $gl.clear($gl.STENCIL_BUFFER_BIT);
        $gl.disable($gl.SCISSOR_TEST);
    }

    // todo
};