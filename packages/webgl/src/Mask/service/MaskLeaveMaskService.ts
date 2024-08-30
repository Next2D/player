import { $setMaskDrawing } from "../../Mask";
import { $context, $gl } from "../../WebGLUtil";

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
        $setMaskDrawing(false);
        $gl.disable($gl.STENCIL_TEST);
        $gl.clear($gl.STENCIL_BUFFER_BIT);
        return ;
    }

    // todo
};