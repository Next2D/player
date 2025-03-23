import type { ITextureObject } from "../../../interface/ITextureObject";
import { $context } from "../../../WebGLUtil";
import { execute as blendOneZeroService } from "../../../Blend/service/BlendOneZeroService";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";
import { execute as variantsGradientLUTShaderService } from "../../Variants/GradientLUT/service/VariantsGradientLUTShaderService";
import { execute as gradientLUTSetFilterUniformService } from "../../GradientLUTGenerator/service/GradientLUTSetFilterUniformService";
import { execute as gradientLUTGeneratorFillTextureUseCase } from "./GradientLUTGeneratorFillTextureUseCase";
import {
    $getGradientAttachmentObject,
    $getGradientLUTGeneratorMaxLength
} from "../../GradientLUTGenerator";

/**
 * @description グラデーションフィルター用のテクスチャを生成します。
 *              Generates a texture for the gradient filter.
 *
 * @param  {Float32Array} ratios
 * @param  {Float32Array} colors
 * @param  {Float32Array} alphas
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    ratios: Float32Array,
    colors: Float32Array,
    alphas: Float32Array
): ITextureObject => {

    const currentAttachment = $context.currentAttachmentObject;

    const gradientAttachmentObject = $getGradientAttachmentObject();
    $context.bind(gradientAttachmentObject);

    const stopsLength = ratios.length;
    blendOneZeroService();

    const maxLength = $getGradientLUTGeneratorMaxLength();
    for (let begin = 0; begin < stopsLength; begin += maxLength - 1) {

        const end = Math.min(begin + maxLength, stopsLength);

        const shaderManager = variantsGradientLUTShaderService(
            end - begin, false
        );

        gradientLUTSetFilterUniformService(
            shaderManager, ratios, colors, alphas, begin, end
        );

        gradientLUTGeneratorFillTextureUseCase(
            shaderManager, ratios[begin] / 255, ratios[end - 1] / 255
        );
    }
    blendResetService();

    if (currentAttachment) {
        $context.bind(currentAttachment);
    }

    return gradientAttachmentObject.texture as ITextureObject;
};