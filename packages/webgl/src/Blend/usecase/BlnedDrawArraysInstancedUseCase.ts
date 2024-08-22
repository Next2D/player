import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute as variantsBlendInstanceShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendInstanceShaderService";
import { $getAtlasTextureObject } from "../../AtlasManager";
import { $activeTextureUnit } from "../../TextureManager";
import { execute as shaderInstancedManagerDrawArraysInstancedUseCase } from "../../Shader/ShaderInstancedManager/usecase/ShaderInstancedManagerDrawArraysInstancedUseCase";
import { execute as blendOperationUseCase } from "../../Blend/usecase/BlendOperationUseCase";
import {
    $gl,
    $context
} from "../../WebGLUtil";
import {
    $drawFrameBuffer,
    $readFrameBuffer
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
    $context.bind($context.atlasAttachmentObject);

    $gl.bindFramebuffer(
        $gl.FRAMEBUFFER,
        $drawFrameBuffer
    );

    const textureObject = $getAtlasTextureObject();
    $gl.activeTexture($gl.TEXTURE3);

    $gl.framebufferTexture2D(
        $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
        $gl.TEXTURE_2D, textureObject.resource, 0
    );

    $gl.blitFramebuffer(
        0, 0, textureObject.width, textureObject.height,
        0, 0, textureObject.width, textureObject.height,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );

    $gl.bindFramebuffer(
        $gl.FRAMEBUFFER,
        $readFrameBuffer
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

    $gl.activeTexture($activeTextureUnit !== -1 
        ? $activeTextureUnit 
        : $gl.TEXTURE0
    );
};