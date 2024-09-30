import {
    $blendState,
    $enabled
} from "../../Blend";
import { execute as blendResetService } from "../../Blend/service/BlendResetService";
import { $gl } from "../../WebGLUtil";

/**
 * @description ブレンドモードを有効にする
 *              Enable blend mode
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if (!$blendState) {
        $enabled();
        $gl.enable($gl.BLEND);
    }

    blendResetService();
};