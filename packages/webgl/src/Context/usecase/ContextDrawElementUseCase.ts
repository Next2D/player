import type { Node } from "@next2d/texture-packer";
import { execute as textureManagerCreateFromCanvasUseCase } from "../../TextureManager/usecase/TextureManagerCreateFromCanvasUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as variantsBlendTextureShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendTextureShaderService";
import { execute as shaderManagerSetTextureUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetTextureUniformService";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as blendResetService } from "../../Blend/service/BlendResetService";

/**
 * @description OffscreenCanvasを描画します。
 *              Draw OffscreenCanvas.
 *
 * @param  {Node} node
 * @param  {OffscreenCanvas | ImageBitmap} element
 * @return {void}
 * @method
 * @protected
 */
export const execute = (node: Node, element: OffscreenCanvas | ImageBitmap): void =>
{
    const textureObject = textureManagerCreateFromCanvasUseCase(node.w, node.h, element);

    const shaderManager = variantsBlendTextureShaderService();
    shaderManagerSetTextureUniformService(shaderManager, node.w, node.h);

    // テクスチャを描画
    blendResetService();
    shaderManagerDrawTextureUseCase(shaderManager);

    // テクスチャオブジェクトを解放
    textureManagerReleaseTextureObjectUseCase(textureObject);
};