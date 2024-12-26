import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { execute as gradientLUTGenerateShapeTextureUseCase } from "../../Shader/GradientLUTGenerator/usecase/GradientLUTGenerateShapeTextureUseCase";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { execute as variantsGradientShapeShaderUseCase } from "../../Shader/Variants/Gradient/usecase/VariantsGradientShapeShaderUseCase";
import { execute as shaderManagerSetGradientFillUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetGradientFillUniformService";
import { $gradientData } from "../../Gradient";
import {
    $gl,
    $linearGradientXY,
    $inverseMatrix,
    $context,
    $poolFloat32Array6,
    $poolFloat32Array4
} from "../../WebGLUtil";

/**
 * @description 線形グラデーションのシェーダーを実行します。
 *              Execute the linear gradient shader.
 *
 * @param  {IVertexArrayObject} vertex_array_object
 * @param  {number} offset
 * @param  {number} index_count
 * @param  {Float32Array | null} [grid_data=null]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    vertex_array_object: IVertexArrayObject,
    offset: number,
    index_count: number,
    grid_data: Float32Array | null
): void => {

    const stops  = $gradientData.shift() as number[];
    const matrix = $gradientData.shift() as Float32Array;
    const spread = $gradientData.shift() as number;
    const interpolation = $gradientData.shift() as number;

    $gl.disable($gl.STENCIL_TEST);
    const textureObject = gradientLUTGenerateShapeTextureUseCase(stops, interpolation);
    textureManagerBind0UseCase(textureObject);

    $gl.enable($gl.STENCIL_TEST);
    $gl.frontFace($gl.CCW);
    $gl.stencilMask(0xff);

    // mask setting
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOpSeparate($gl.FRONT, $gl.KEEP, $gl.KEEP, $gl.INCR_WRAP);
    $gl.stencilOpSeparate($gl.BACK,  $gl.KEEP, $gl.KEEP, $gl.DECR_WRAP);
    $gl.colorMask(false, false, false, false);

    const useGrid = !!grid_data;
    const coverageShader = variantsShapeMaskShaderService(useGrid);
    if (grid_data) {
        shaderManagerSetMaskUniformService(coverageShader, grid_data);
    }

    $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    shaderManagerFillUseCase(
        coverageShader, vertex_array_object, offset, index_count
    );
    $gl.disable($gl.SAMPLE_ALPHA_TO_COVERAGE);

    $gl.stencilFunc($gl.NOTEQUAL, 0, 0xff);
    $gl.stencilOp($gl.KEEP, $gl.ZERO, $gl.ZERO);
    $gl.colorMask(true, true, true, true);

    const shaderManager = variantsGradientShapeShaderUseCase(
        false, false, spread, useGrid
    );

    const points = $linearGradientXY(matrix);
    const inverseMatrix = $inverseMatrix($context.$matrix);
    shaderManagerSetGradientFillUniformService(
        shaderManager, 0, $context.$matrix,
        inverseMatrix, 0, points, grid_data
    );

    $poolFloat32Array4(points);
    $poolFloat32Array6(inverseMatrix);

    shaderManagerFillUseCase(
        shaderManager, vertex_array_object, offset, index_count
    );
};