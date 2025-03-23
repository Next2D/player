import type { Node } from "@next2d/texture-packer";
import { execute as textureManagerCreateFromPixelsUseCase } from "../../TextureManager/usecase/TextureManagerCreateFromPixelsUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as variantsBlendTextureShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendTextureShaderService";
import { execute as shaderManagerSetTextureUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetTextureUniformService";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as blendResetService } from "../../Blend/service/BlendResetService";

/**
 * @description ピクセルを描画します。
 *              Draw pixels.
 *
 * @param  {Node} node
 * @param  {Uint8Array} pixels
 * @return {void}
 * @method
 * @protected
 */
export const execute = (node: Node, pixels: Uint8Array): void =>
{
    const textureObject = textureManagerCreateFromPixelsUseCase(node.w, node.h, pixels);

    const shaderManager = variantsBlendTextureShaderService();
    shaderManagerSetTextureUniformService(shaderManager, node.w, node.h);

    // テクスチャを描画
    blendResetService();
    shaderManagerDrawTextureUseCase(shaderManager);

    // テクスチャオブジェクトを解放
    textureManagerReleaseTextureObjectUseCase(textureObject);
};