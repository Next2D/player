import { $clipBounds } from "../../Mask";
import {
    $gl,
    $context,
    $getFloat32Array4
} from "../../WebGLUtil";

/**
 * @description マスクの描画範囲をセット
 *              Set the drawing range of the mask.
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

    // レベルと描画範囲をセット
    $clipBounds.set(
        currentAttachmentObject.clipLevel,
        $getFloat32Array4(x_min, y_min, x_max, y_max)
    );

    const width  = Math.ceil(Math.abs(x_max - x_min));
    const height = Math.ceil(Math.abs(y_max - y_min));
    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(
        x_min,
        currentAttachmentObject.height - y_min - height,
        width,
        height
    );
};