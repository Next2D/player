import {
    $gl,
    $context
} from "../../WebGLUtil";

/**
 * @description マスクの描画を終了
 *              End mask drawing
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

    const clipLevel = currentAttachmentObject.clipLevel;

    let mask = 0;
    for (let idx = 0; idx < clipLevel; ++idx) {
        mask |= (1 << clipLevel - idx) - 1;
    }

    $gl.disable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    $gl.stencilFunc($gl.EQUAL, mask & 0xff, mask);
    $gl.stencilOp($gl.KEEP, $gl.KEEP, $gl.KEEP);
    $gl.stencilMask(0xff);
    $gl.colorMask(true, true, true, true);
    $gl.disable($gl.SCISSOR_TEST);
};