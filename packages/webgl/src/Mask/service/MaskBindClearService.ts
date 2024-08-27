import { $setMaskDrawing } from "../../Mask";
import { $gl } from "../../WebGLUtil";

export const execute = (mask: boolean): void =>
{
    if (mask) {
        $gl.enable($gl.STENCIL_TEST);
        $setMaskDrawing(true);
    }
};