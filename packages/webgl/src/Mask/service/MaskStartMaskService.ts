import {
    $gl,
    $context
} from "../../WebGLUtil";

/**
 * @description マスクの描画を開始
 *              Start mask drawing
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

    $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOp($gl.KEEP, $gl.INVERT, $gl.INVERT);
    $gl.stencilMask(1 << currentAttachmentObject.clipLevel - 1);
    $gl.colorMask(false, false, false, false);
};