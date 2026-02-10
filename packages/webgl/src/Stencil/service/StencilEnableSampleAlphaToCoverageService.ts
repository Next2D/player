import { $gl } from "../../WebGLUtil";
import {
    $sampleAlphaToCoverageEnabled,
    $setSampleAlphaToCoverageEnabled
} from "../../Stencil";

export const execute = (): void =>
{
    if (!$sampleAlphaToCoverageEnabled) {
        $setSampleAlphaToCoverageEnabled(true);
        $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    }
};
