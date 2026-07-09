import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as variantsGradientLUTShaderService } from "../../Variants/GradientLUT/service/VariantsGradientLUTShaderService";
import { execute as blendOneZeroService } from "../../../Blend/service/BlendOneZeroService";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";
import { execute as gradientLUTSetUniformService } from "../service/GradientLUTSetUniformService";
import { execute as gradientLUTGeneratorFillTextureUseCase } from "./GradientLUTGeneratorFillTextureUseCase";
import {
    $context,
    $enableScissorTest,
    $disableScissorTest,
    $scissorBox,
    $setScissorBox
} from "../../../WebGLUtil";
import {
    $getGradientAttachmentObjectWithResolution,
    $getAdaptiveResolution,
    $getGradientLUTGeneratorMaxLength,
    $rgbIdentityTable,
    $rgbToLinearTable,
    $getShapeLUTFromCache,
    $setShapeLUTToCache
} from "../../GradientLUTGenerator";
import { execute as textureManagerGetTextureUseCase } from "../../../TextureManager/usecase/TextureManagerGetTextureUseCase";
import { $gl } from "../../../WebGLUtil";

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
    // stops+interpolation が一致するLUTはピクセルが同一のため、
    // キャッシュヒット時は生成描画(FBO切替+drawArrays)を丸ごとスキップする
    const lutKey = `${interpolation}_${stops.join(",")}`;
    const cachedTextureObject = $getShapeLUTFromCache(lutKey);
    if (cachedTextureObject) {
        return cachedTextureObject;
    }

    const currentAttachment = $context.currentAttachmentObject;

    // JS側で追跡しているscissor矩形を退避（getParameterの同期クエリを回避）
    const scissorX = $scissorBox[0];
    const scissorY = $scissorBox[1];
    const scissorW = $scissorBox[2];
    const scissorH = $scissorBox[3];
    $disableScissorTest();

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

    // 生成したLUTを専用テクスチャへ複製してキャッシュする。
    // gradientアタッチメントがREADフレームバッファにバインドされたまま
    // 全域(resolution×1)をコピーするため、内容は共有テクスチャと完全一致。
    const lutTextureObject = textureManagerGetTextureUseCase(resolution, 1);
    $gl.copyTexSubImage2D($gl.TEXTURE_2D, 0, 0, 0, 0, 0, resolution, 1);
    $setShapeLUTToCache(lutKey, lutTextureObject);

    if (currentAttachment) {
        $context.bind(currentAttachment);
    }

    // bugfix: @see https://github.com/Next2D/player/issues/234
    $enableScissorTest();
    $setScissorBox(scissorX, scissorY, scissorW, scissorH);

    return lutTextureObject;
};