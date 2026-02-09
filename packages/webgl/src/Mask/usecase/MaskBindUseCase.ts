
import { execute as maskEndMaskService } from "../service/MaskEndMaskService";
import {
    $enableStencilTest,
    $disableStencilTest,
    $disableScissorTest
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
        $setMaskDrawing(false);

        $disableStencilTest();
        $disableScissorTest();
    } else if (mask && !$isMaskDrawing()) {
        $setMaskDrawing(true);

        // キャッシュ作成後は、マスクの状態を復元する
        $enableStencilTest();
        maskEndMaskService();
    }
};