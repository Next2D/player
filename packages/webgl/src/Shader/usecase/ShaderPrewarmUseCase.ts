import { execute as variantsBlendInstanceShaderService } from "../Variants/Blend/service/VariantsBlendInstanceShaderService";
import { execute as variantsBlendTexturePremultiplyShaderService } from "../Variants/Blend/service/VariantsBlendTexturePremultiplyShaderService";
import { execute as variantsBlendMatrixTextureShaderService } from "../Variants/Blend/service/VariantsBlendMatrixTextureShaderService";
import { execute as variantsBlendTextBatchShaderService } from "../Variants/Blend/service/VariantsBlendTextBatchShaderService";
import { execute as variantsShapeMaskShaderService } from "../Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as variantsShapeSolidColorShaderService } from "../Variants/Shape/service/VariantsShapeSolidColorShaderService";
import { execute as variantsGradientShapeShaderUseCase } from "../Variants/Gradient/usecase/VariantsGradientShapeShaderUseCase";
import { execute as variantsGradientLUTShaderService } from "../Variants/GradientLUT/service/VariantsGradientLUTShaderService";
import { $GRADIENT_LUT_SHARED_STOPS } from "../GradientLUTGenerator";

/**
 * @description グラデーションの spread の既定値 (pad)
 *              The default gradient spread (pad)
 *
 * @type {number}
 * @private
 */
const $SPREAD_PAD: number = 2;

/**
 * @description 基本の描画で必ず使うシェーダーを、最初の描画より前に作っておく。
 *              シェーダーは初めて使うときにコンパイルとリンクが走り、環境によっては 1 本あたり数十ミリ秒
 *              描画を止める。起動時にまとめて済ませて、最初の画面の動きの途中で止まらないようにする。
 *              対象は、表示内容によらず使うもの (塗り・マスク・アトラスへの合成・インスタンス描画・文字) と、
 *              グラデーションの既定の組み合わせ (線形・放射状、ストップ数の共用分) だけ。
 *              フィルターやブレンドモードごとのシェーダーは、使うときに作る。
 *              Create the shaders that basic drawing always needs before the first draw.
 *              A shader is compiled and linked on first use, which can stall drawing for tens of
 *              milliseconds per program on some platforms. Doing it at start-up keeps the stall out of
 *              the first screen's motion. Only the shaders used regardless of content (fill, mask,
 *              compositing into the atlas, instanced draw, text) and the default gradient combinations
 *              (linear / radial, the shared stop count) are created here. Shaders per filter or
 *              blend mode are still created on demand.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    variantsBlendInstanceShaderService();
    variantsBlendTexturePremultiplyShaderService();
    variantsBlendMatrixTextureShaderService(false);
    variantsBlendTextBatchShaderService();
    variantsShapeMaskShaderService(false);
    variantsShapeSolidColorShaderService(false);

    variantsGradientLUTShaderService($GRADIENT_LUT_SHARED_STOPS, false);
    variantsGradientShapeShaderUseCase(false, false, $SPREAD_PAD, false);
    variantsGradientShapeShaderUseCase(true, false, $SPREAD_PAD, false);
};
