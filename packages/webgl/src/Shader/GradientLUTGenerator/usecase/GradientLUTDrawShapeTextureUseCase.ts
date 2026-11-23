import type { IAttachmentObject } from "../../../interface/IAttachmentObject";
import { execute as variantsGradientLUTShaderService } from "../../Variants/GradientLUT/service/VariantsGradientLUTShaderService";
import { execute as gradientLUTSetUniformService } from "../service/GradientLUTSetUniformService";
import { execute as gradientLUTGeneratorFillTextureUseCase } from "./GradientLUTGeneratorFillTextureUseCase";
import { $context } from "../../../WebGLUtil";
import {
    $getGradientLUTGeneratorMaxLength,
    $rgbIdentityTable,
    $rgbToLinearTable
} from "../../GradientLUTGenerator";

/**
 * @description 指定の描画先へ、グラデーションの LUT を描きます。
 *              描画先は切り替えたままにします (元へ戻すのは呼び出し側)。
 *              ブレンド・シザー・ステンシルの設定も呼び出し側で行います。
 *              Draw the gradient LUT into the given target. The target stays bound (the caller
 *              switches back). The caller also sets up blending, the scissor and the stencil.
 *
 * @param  {IAttachmentObject} attachment_object
 * @param  {array} stops
 * @param  {number} interpolation
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    attachment_object: IAttachmentObject,
    stops: number[],
    interpolation: number
): void => {

    $context.bind(attachment_object);

    const isLinearSpace = interpolation === 0;
    const stopsLength = stops.length / 5;

    const table: Float32Array = isLinearSpace
        ? $rgbToLinearTable
        : $rgbIdentityTable;

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
};
