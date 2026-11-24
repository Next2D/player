import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as variantsShapeSolidColorShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeSolidColorShaderService";
import { execute as vertexArrayObjectBindService } from "../../VertexArrayObject/service/VertexArrayObjectBindService";
import { execute as blendResetService } from "../../Blend/service/BlendResetService";
import { $nativeSolidFills } from "../../WebGLUtil";
import {
    STENCIL_MODE_FILL,
    $setStencilMode,
    $setColorMaskEnabled,
    $setSampleAlphaToCoverageEnabled
} from "../../Stencil";

/**
 * @description 単色の塗り (9スライスなし) が続く範囲を、実行環境の関数 1 回でまとめて実行します。
 *              ContextNormalFillUseCase を塗りの数だけ繰り返すのと同じ結果になります。
 *              実行環境が __next2dSolidFills を持つ場合 ($nativeSolidFills が null でない場合) だけ呼びます。
 *              Executes a run of consecutive solid fills (without 9-slice) with a single call
 *              into the runtime. The result is the same as repeating ContextNormalFillUseCase
 *              for each fill. Call only where the runtime provides __next2dSolidFills
 *              ($nativeSolidFills is not null).
 *
 * @param  {IVertexArrayObject} vertex_array_object
 * @param  {number} offset
 * @param  {Int32Array} counts - 塗りごとの頂点数 / vertex count of each fill
 * @param  {number} length - counts のうち使う個数 / number of entries of counts to use
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    vertex_array_object: IVertexArrayObject,
    offset: number,
    counts: Int32Array,
    length: number
): void =>
{
    const coverageShader = variantsShapeMaskShaderService(false);
    const shaderManager  = variantsShapeSolidColorShaderService(false);

    // 塗りごとに行っていた準備を、先に 1 回だけ行う (塗りの間で値は変わらない)
    coverageShader.useProgram();
    coverageShader.bindUniform();
    shaderManager.useProgram();
    shaderManager.bindUniform();

    // set alpha
    blendResetService();

    // bind vertex array
    vertexArrayObjectBindService(vertex_array_object);

    ($nativeSolidFills as NonNullable<typeof $nativeSolidFills>)(
        coverageShader.program, shaderManager.program,
        offset, length, counts
    );

    // 実行環境は、最後の塗りを終えた状態 (色を塗る設定) で戻る。状態の控えをそれに合わせる
    $setStencilMode(STENCIL_MODE_FILL);
    $setColorMaskEnabled(true);
    $setSampleAlphaToCoverageEnabled(false);
};
