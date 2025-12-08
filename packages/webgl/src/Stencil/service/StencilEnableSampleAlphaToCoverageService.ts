import { $gl } from "../../WebGLUtil";
import {
    $getSampleAlphaToCoverageEnabled,
    $setSampleAlphaToCoverageEnabled
} from "../../Stencil";

/**
 * @description SAMPLE_ALPHA_TO_COVERAGEを有効化
 *              Enable SAMPLE_ALPHA_TO_COVERAGE
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if (!$getSampleAlphaToCoverageEnabled()) {
        $setSampleAlphaToCoverageEnabled(true);
        $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    }
};
