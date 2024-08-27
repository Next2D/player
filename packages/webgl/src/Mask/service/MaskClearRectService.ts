import { $setMaskDrawing } from "../../Mask";
import { $gl, $context } from "../../WebGLUtil";

export const execute = (): void =>
{
    $gl.disable($gl.STENCIL_TEST);
    $setMaskDrawing(false);

    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(
        $context.maskBounds.xMin,
        $context.maskBounds.yMin,
        Math.abs($context.maskBounds.xMax - $context.maskBounds.xMin),
        Math.abs($context.maskBounds.yMax - $context.maskBounds.yMin)
    );
    $gl.clear($gl.STENCIL_BUFFER_BIT);
    $gl.disable($gl.SCISSOR_TEST);
};