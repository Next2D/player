import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as variantsGradientLUTShaderService } from "../../Variants/GradientLUT/service/VariantsGradientLUTShaderService";
import { execute as blendOneZeroService } from "../../../Blend/service/BlendOneZeroService";
import { execute as gradientLUTSetUniformService } from "../service/GradientLUTSetUniformService";
import { execute as gradientLUTGeneratorFillTextureUseCase } from "../usecase/GradientLUTGeneratorFillTextureUseCase";
import { execute as contextBeginNodeRenderingService } from "../../../Context/service/ContextBeginNodeRenderingService";
import {
    $gl,
    $context
} from "../../../WebGLUtil"
import {
    $getGradientAttachmentObject,
    $getGradientLUTGeneratorMaxLength,
    $rgbIdentityTable,
    $rgbToLinearTable
} from "../../GradientLUTGenerator";

/**
 * @description グラデーションのテクスチャを生成します。
 *              Generates a texture of the gradient.
 * 
 * @param  {array} stops
 * @param  {number} interpolation
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (stops: number[], interpolation: number): ITextureObject =>
{
    const currentAttachment = $context.currentAttachmentObject;
    const scissorBox = $gl.getParameter($gl.SCISSOR_BOX);
    $gl.disable($gl.SCISSOR_TEST);

    const gradientAttachmentObject = $getGradientAttachmentObject();
    $context.bind(gradientAttachmentObject);

    const isLinearSpace = interpolation === 0;
    const stopsLength = stops.length / 5;

    const table: Float32Array = isLinearSpace
        ? $rgbToLinearTable
        : $rgbIdentityTable;

    blendOneZeroService();

    const maxLength = $getGradientLUTGeneratorMaxLength();
    for (let begin = 0; begin < stopsLength; begin += maxLength - 1) {

        const end: number = Math.min(begin + maxLength, stopsLength);

        const shaderManager = variantsGradientLUTShaderService(
            end - begin, isLinearSpace
        );

        gradientLUTSetUniformService(
            shaderManager, stops, begin, end, table
        );
        
        gradientLUTGeneratorFillTextureUseCase(
            shaderManager,
            stops[0],
            stops[stops.length - 5]
        );
    }

    if (currentAttachment) {
        $context.bind(currentAttachment);
    }

    contextBeginNodeRenderingService(
        scissorBox[0], scissorBox[1], scissorBox[2], scissorBox[3]
    );

    return gradientAttachmentObject.texture as NonNullable<ITextureObject>;
}