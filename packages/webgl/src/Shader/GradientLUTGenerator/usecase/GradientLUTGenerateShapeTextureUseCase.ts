import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as variantsGradientLUTShaderService } from "../../Variants/GradientLUT/service/VariantsGradientLUTShaderService";
import { execute as blendOneZeroService } from "../../../Blend/service/BlendOneZeroService";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";
import { execute as gradientLUTSetUniformService } from "../service/GradientLUTSetUniformService";
import { execute as gradientLUTGeneratorFillTextureUseCase } from "./GradientLUTGeneratorFillTextureUseCase";
import {
    $gl,
    $context
} from "../../../WebGLUtil";
import {
    $getGradientAttachmentObjectWithResolution,
    $getAdaptiveResolution,
    $getGradientLUTGeneratorMaxLength,
    $rgbIdentityTable,
    $rgbToLinearTable
} from "../../GradientLUTGenerator";

/**
 * @description グラデーションのテクスチャを生成します。
 *              Generates a texture of the gradient.
 *              注意: グラデーションLUTは共有テクスチャに描画されるため、
 *              キャッシュは使用しません。各フレームで再描画が必要です。
 *              Note: Gradient LUT is drawn to a shared texture, so caching
 *              is not used. Re-drawing is required each frame.
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

    const isLinearSpace = interpolation === 0;
    const stopsLength = stops.length / 5;

    // 適応的解像度を使用
    const resolution = $getAdaptiveResolution(stopsLength);
    const gradientAttachmentObject = $getGradientAttachmentObjectWithResolution(resolution);
    $context.bind(gradientAttachmentObject);

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
    blendResetService();

    if (currentAttachment) {
        $context.bind(currentAttachment);
    }

    // bugfix: @see https://github.com/Next2D/player/issues/234
    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(scissorBox[0], scissorBox[1], scissorBox[2], scissorBox[3]);

    return gradientAttachmentObject.texture as NonNullable<ITextureObject>;
};