import { $gl } from "../../WebGLUtil";
import {
    $getStencilMode,
    $setStencilMode,
    $getColorMaskEnabled,
    $setColorMaskEnabled,
    STENCIL_MODE_FILL
} from "../../Stencil";

/**
 * @description ステンシルを塗り描画モードに設定
 *              Set stencil to fill drawing mode
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($getStencilMode() !== STENCIL_MODE_FILL) {
        $setStencilMode(STENCIL_MODE_FILL);

        $gl.stencilFunc($gl.NOTEQUAL, 0, 0xff);
        $gl.stencilOp($gl.KEEP, $gl.ZERO, $gl.ZERO);
    }

    if (!$getColorMaskEnabled()) {
        $setColorMaskEnabled(true);
        $gl.colorMask(true, true, true, true);
    }
};
