
import { execute as maskEndMaskService } from "../service/MaskEndMaskService";
import {
    $gl,
    $context
} from "../../WebGLUtil";
import {
    $isMaskDrawing,
    $setMaskDrawing
} from "../../Mask";

/**
 * @description マスクOn/Offに合わせたバインド処理
 *              Binding process according to mask On/Off
 * 
 * @param  {boolean} mask 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (mask: boolean): void =>
{
    if (!mask && $isMaskDrawing()) {
        $gl.disable($gl.STENCIL_TEST);
        $gl.disable($gl.SCISSOR_TEST);
        $setMaskDrawing(false);
    } else if (mask && !$isMaskDrawing()) {
        // キャッシュ作成後は、マスクの状態を復元する
        $gl.enable($gl.STENCIL_TEST);
        $gl.enable($gl.SCISSOR_TEST);
        $gl.scissor(
            $context.maskBounds.xMin,
            $context.maskBounds.yMin,
            Math.abs($context.maskBounds.xMax - $context.maskBounds.xMin),
            Math.abs($context.maskBounds.yMax - $context.maskBounds.yMin)
        );
        $setMaskDrawing(true);
        maskEndMaskService();
    }
};