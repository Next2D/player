import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { execute as gradientLUTGenerateShapeTextureUseCase } from "../../Shader/GradientLUTGenerator/usecase/GradientLUTGenerateShapeTextureUseCase";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as variantsGradientShapeShaderUseCase } from "../../Shader/Variants/Gradient/usecase/VariantsGradientShapeShaderUseCase";
import { execute as shaderManagerSetGradientFillUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetGradientFillUniformService";
import { $gradientData } from "../../Gradient";
import {
    $gl,
    $inverseMatrix,
    $context,
    $poolFloat32Array6
} from "../../WebGLUtil";

/**
 * @description 放射状グラデーションのシェーダーを実行します。
 *              Execute the radial gradient shader.
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
    const focal = $gradientData.shift() as number;

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

    $context.save();
    $context.transform(
        matrix[0], matrix[1], matrix[2],
        matrix[3], matrix[4], matrix[5]
    );

    const prevMatrix = $context.$stack[$context.$stack.length - 1];

    const inverseMatrix = $inverseMatrix($context.$matrix);

    const shaderManager = variantsGradientShapeShaderUseCase(
        true, Boolean(focal), spread, useGrid
    );
    shaderManagerSetGradientFillUniformService(
        shaderManager, 1, prevMatrix,
        inverseMatrix, focal, grid_data
    );

    $context.restore();

    $poolFloat32Array6(inverseMatrix);

    shaderManagerFillUseCase(
        shaderManager, vertex_array_object, offset, index_count
    );
};