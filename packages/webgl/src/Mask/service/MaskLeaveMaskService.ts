import { $setMaskDrawing } from "../../Mask";
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
        // $gl.enable($gl.SCISSOR_TEST);
        // $gl.scissor(
        //     $context.maskBounds.xMin,
        //     $context.maskBounds.yMin,
        //     Math.abs($context.maskBounds.xMax - $context.maskBounds.xMin),
        //     Math.abs($context.maskBounds.yMax - $context.maskBounds.yMin)
        // );
        $gl.clear($gl.STENCIL_BUFFER_BIT);
        $gl.disable($gl.SCISSOR_TEST);
        $setMaskDrawing(false);
    }

    // todo
};