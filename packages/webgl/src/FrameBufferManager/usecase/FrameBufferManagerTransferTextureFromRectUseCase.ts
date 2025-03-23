import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as variantsBlendTextureShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendTextureShaderService";
import { execute as shaderManagerSetTextureUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetTextureUniformService";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as blendOneZeroService } from "../../Blend/service/BlendOneZeroService";
import { execute as blendResetService } from "../../Blend/service/BlendResetService";

/**
 * @description メインのアタッチメントオブジェクトをメインキャンバスに転送します。
 *              Transfer the main attachment object to the main canvas.
 *
 * @param  {ITextureObject} texture_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (texture_object: ITextureObject): void =>
{
    // ブレンドするテクスチャをバインド
    textureManagerBind0UseCase(texture_object);

    blendOneZeroService();

    // blend用のシェーダーを取得
    const shaderManager = variantsBlendTextureShaderService();
    shaderManagerSetTextureUniformService(
        shaderManager, texture_object.width, texture_object.height
    );

    shaderManagerDrawTextureUseCase(shaderManager);
    blendResetService();
};