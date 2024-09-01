import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as variantsGradientLUTShaderService } from "../../Variants/GradientLUT/service/VariantsGradientLUTShaderService";
import { execute as blendOneZeroService } from "../../../Blend/service/BlendOneZeroService";
import { execute as gradientLUTSetUniformService } from "../service/GradientLUTSetUniformService";
import { execute as gradientLUTGeneratorFillTextureUseCase } from "../usecase/GradientLUTGeneratorFillTextureUseCase";
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
    const viewport = $gl.getParameter($gl.VIEWPORT);
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

        // const end: number = Math.min(begin + maxLength, stopsLength);

        // const shaderManager = variantsGradientLUTShaderService(
        //     end - begin, isLinearSpace
        // );

        // gradientLUTSetUniformService(
        //     shaderManager, stops, begin, end, table
        // );

        // gradientLUTGeneratorFillTextureUseCase(
        //     shaderManager,
        //     begin === 0 ? 0 : stops[0],
        //     end === stopsLength ? 1 : stops[(end - 1) * 5]
        // );
    }

    if (currentAttachment) {
        $context.bind(currentAttachment);
    }

    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(viewport[0], viewport[1], viewport[2], viewport[3]);
    $gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);

    return gradientAttachmentObject.texture as NonNullable<ITextureObject>;
}