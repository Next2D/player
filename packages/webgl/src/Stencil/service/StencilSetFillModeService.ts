import { $gl } from "../../WebGLUtil";
import {
    $currentStencilMode,
    $setStencilMode,
    $colorMaskEnabled,
    $setColorMaskEnabled,
    STENCIL_MODE_FILL
} from "../../Stencil";

export const execute = (): void =>
{
    if ($currentStencilMode !== STENCIL_MODE_FILL) {
        $setStencilMode(STENCIL_MODE_FILL);

        $gl.stencilFunc($gl.NOTEQUAL, 0, 0xff);
        $gl.stencilOp($gl.KEEP, $gl.ZERO, $gl.ZERO);
    }

    if (!$colorMaskEnabled) {
        $setColorMaskEnabled(true);
        $gl.colorMask(true, true, true, true);
    }
};
