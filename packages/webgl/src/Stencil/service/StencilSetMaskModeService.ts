import { $gl } from "../../WebGLUtil";
import {
    $currentStencilMode,
    $setStencilMode,
    $colorMaskEnabled,
    $setColorMaskEnabled,
    STENCIL_MODE_MASK
} from "../../Stencil";

export const execute = (): void =>
{
    if ($currentStencilMode !== STENCIL_MODE_MASK) {
        $setStencilMode(STENCIL_MODE_MASK);

        $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
        $gl.stencilOpSeparate($gl.FRONT, $gl.KEEP, $gl.KEEP, $gl.INCR_WRAP);
        $gl.stencilOpSeparate($gl.BACK, $gl.KEEP, $gl.KEEP, $gl.DECR_WRAP);
    }

    if ($colorMaskEnabled) {
        $setColorMaskEnabled(false);
        $gl.colorMask(false, false, false, false);
    }
};
