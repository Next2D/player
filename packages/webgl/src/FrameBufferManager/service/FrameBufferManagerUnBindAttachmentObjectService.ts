import { $gl } from "../../WebGLUtil";
import {
    $setCurrentAttachment,
    $useFramebufferBound,
    $setFramebufferBound
} from "../../FrameBufferManager";

/**
 * @description 現在アタッチされているFramebufferのバインド解除
 *              Unbind the currently attached Framebuffer
 * 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    $setCurrentAttachment(null);

    if ($useFramebufferBound()) {
        $setFramebufferBound(false);
        $gl.bindFramebuffer($gl.FRAMEBUFFER, null);
    }
};