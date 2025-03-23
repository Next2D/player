import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as textureManagerBind0UseCase } from "../../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as variantsBlurFilterShaderService } from "../../../Shader/Variants/Filter/service/VariantsBlurFilterShaderService";
import { execute as shaderManagerSetBlurFilterUniformService } from "../../../Shader/ShaderManager/service/ShaderManagerSetBlurFilterUniformService";
import { execute as shaderManagerDrawTextureUseCase } from "../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";

/**
 * @description 指定方向にぼかしフィルターを適用します。
 *              Apply the blur filter in the specified direction.
 *
 * @param  {ITextureObject} texture_object
 * @param  {boolean} is_horizontal
 * @param  {number} blur
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    is_horizontal: boolean,
    blur: number
): void => {

    textureManagerBind0UseCase(texture_object, true);

    const halfBlur = Math.ceil(blur * 0.5);
    const fraction = 1 - (halfBlur - blur * 0.5);
    const samples  = 1 + blur;

    const shaderManager = variantsBlurFilterShaderService(halfBlur);
    shaderManagerSetBlurFilterUniformService(
        shaderManager,
        texture_object.width, texture_object.height,
        is_horizontal, fraction, samples
    );
    shaderManagerDrawTextureUseCase(shaderManager);
};