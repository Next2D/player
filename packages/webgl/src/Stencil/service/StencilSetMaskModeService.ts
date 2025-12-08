import { $gl } from "../../WebGLUtil";
import {
    $getStencilMode,
    $setStencilMode,
    $getColorMaskEnabled,
    $setColorMaskEnabled,
    STENCIL_MODE_MASK
} from "../../Stencil";

/**
 * @description ステンシルをマスク描画モードに設定
 *              Set stencil to mask drawing mode
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($getStencilMode() !== STENCIL_MODE_MASK) {
        $setStencilMode(STENCIL_MODE_MASK);

        $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
        $gl.stencilOpSeparate($gl.FRONT, $gl.KEEP, $gl.KEEP, $gl.INCR_WRAP);
        $gl.stencilOpSeparate($gl.BACK, $gl.KEEP, $gl.KEEP, $gl.DECR_WRAP);
    }

    if ($getColorMaskEnabled()) {
        $setColorMaskEnabled(false);
        $gl.colorMask(false, false, false, false);
    }
};
