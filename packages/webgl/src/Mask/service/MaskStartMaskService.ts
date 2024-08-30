import {
    $gl,
    $context
} from "../../WebGLUtil";

/**
 * @description マスクの描画を開始
 *              Start mask drawing
 * 
 * @param  {number} x_min
 * @param  {number} y_min
 * @param  {number} x_max
 * @param  {number} y_max
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

    const currentAttachmentObject = $context.currentAttachmentObject;
    if (!currentAttachmentObject) {
        return ;
    }

    $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOp($gl.KEEP, $gl.INVERT, $gl.INVERT);
    $gl.stencilMask(1 << currentAttachmentObject.clipLevel - 1);
    $gl.colorMask(false, false, false, false);

    const width  = Math.abs(x_max - x_min);
    const height = Math.abs(y_max - y_min);
    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(
        x_min, 
        currentAttachmentObject.height - y_min - height, 
        width,
        height
    );
};