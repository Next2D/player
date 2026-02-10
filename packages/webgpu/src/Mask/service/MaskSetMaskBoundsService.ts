import {
    $clipBounds
} from "../../Mask";
import {
    $context,
    $getFloat32Array4
} from "../../WebGPUUtil";

/**
 * @description マスク範囲の設定
 *              Set mask bounds
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
): void =>
{
    const currentAttachmentObject = $context.currentAttachmentObject;
    if (!currentAttachmentObject) {
        return;
    }

    const clipLevel = currentAttachmentObject.clipLevel;
    let bounds = $clipBounds.get(clipLevel);
    if (bounds) {
        bounds[0] = Math.min(bounds[0], x_min);
        bounds[1] = Math.min(bounds[1], y_min);
        bounds[2] = Math.max(bounds[2], x_max);
        bounds[3] = Math.max(bounds[3], y_max);
    } else {
        bounds = $getFloat32Array4();
        bounds[0] = x_min;
        bounds[1] = y_min;
        bounds[2] = x_max;
        bounds[3] = y_max;
        $clipBounds.set(clipLevel, bounds);
    }
};
