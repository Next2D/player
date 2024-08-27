import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute as variantsBlendInstanceShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendInstanceShaderService";
import { execute as shaderInstancedManagerDrawArraysInstancedUseCase } from "../../Shader/ShaderInstancedManager/usecase/ShaderInstancedManagerDrawArraysInstancedUseCase";
import { execute as blendOperationUseCase } from "../../Blend/usecase/BlendOperationUseCase";
import {
    $gl,
    $context
} from "../../WebGLUtil";
import {
    $atlasFrameBuffer,
    $setFramebufferBound
} from "../../FrameBufferManager";

/**
 * @description インスタンス描画を実行します。
 *              Execute instance drawing.
 * 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const shaderInstancedManager = variantsBlendInstanceShaderService();
    if (!shaderInstancedManager.count) {
        return ;
    }
    
    const currentAttachmentObject = $context.currentAttachmentObject;

    const atlasAttachmentObject = $context.atlasAttachmentObject;
    $context.bind(atlasAttachmentObject);

    $gl.bindFramebuffer(
        $gl.DRAW_FRAMEBUFFER,
        $atlasFrameBuffer
    );
    $setFramebufferBound(false);

    $gl.blitFramebuffer(
        0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
        0, 0, atlasAttachmentObject.width, atlasAttachmentObject.height,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );

    $context.bind($context.$mainAttachmentObject as IAttachmentObject);
    blendOperationUseCase($context.globalCompositeOperation);

    shaderInstancedManagerDrawArraysInstancedUseCase(
        shaderInstancedManager
    );

    shaderInstancedManager.clear();

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }
};