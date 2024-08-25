
import { $gl } from "../../WebGLUtil";
import { execute as maskEndMaskService } from "../service/MaskEndMaskService";
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
        $setMaskDrawing(false);
    } else if (mask && !$isMaskDrawing()) {
        // キャッシュ作成後は、マスクの状態を復元する
        $gl.enable($gl.STENCIL_TEST);
        $setMaskDrawing(true);
        maskEndMaskService();
    }
};