import { $gl } from "../../WebGLUtil";
import {
    $getSampleAlphaToCoverageEnabled,
    $setSampleAlphaToCoverageEnabled
} from "../../Stencil";

/**
 * @description SAMPLE_ALPHA_TO_COVERAGEを無効化
 *              Disable SAMPLE_ALPHA_TO_COVERAGE
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($getSampleAlphaToCoverageEnabled()) {
        $setSampleAlphaToCoverageEnabled(false);
        $gl.disable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    }
};
