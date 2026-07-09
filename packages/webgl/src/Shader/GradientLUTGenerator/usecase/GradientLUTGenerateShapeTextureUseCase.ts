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

        // 先頭チャンクは0、末尾チャンクは1まで矩形を拡張して描画する。
        // シェーダー側が最初/最後のストップ色でパディングするため、
        // ストップ範囲外のtexelが未描画(前回内容のまま)になるのを防ぐ。
        gradientLUTGeneratorFillTextureUseCase(
            shaderManager,
            begin === 0 ? 0 : stops[begin * 5],
            end === stopsLength ? 1 : stops[(end - 1) * 5]
        );
    }
    blendResetService();

    if (currentAttachment) {
        $context.bind(currentAttachment);
    }

    // bugfix: @see https://github.com/Next2D/player/issues/234
    $enableScissorTest();
    $setScissorBox(scissorX, scissorY, scissorW, scissorH);

    return gradientAttachmentObject.texture as NonNullable<ITextureObject>;
};
