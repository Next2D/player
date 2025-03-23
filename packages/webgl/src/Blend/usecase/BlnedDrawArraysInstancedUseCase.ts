import { execute as variantsBlendInstanceShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendInstanceShaderService";
import { execute as shaderInstancedManagerDrawArraysInstancedUseCase } from "../../Shader/ShaderInstancedManager/usecase/ShaderInstancedManagerDrawArraysInstancedUseCase";
import { execute as blendOperationUseCase } from "../../Blend/usecase/BlendOperationUseCase";
import { execute as frameBufferManagerTransferAtlasTextureService } from "../../FrameBufferManager/service/FrameBufferManagerTransferAtlasTextureService";
import { $context } from "../../WebGLUtil";

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

    // Transfer to atlas texture.
    frameBufferManagerTransferAtlasTextureService();

    blendOperationUseCase($context.globalCompositeOperation);
    shaderInstancedManagerDrawArraysInstancedUseCase(
        shaderInstancedManager
    );

    shaderInstancedManager.clear();
};