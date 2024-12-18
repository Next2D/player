import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { execute as variantsShapeSolidColorShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeSolidColorShaderService";
import { execute as shaderManagerSetFillUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetFillUniformService";
import { $gl } from "../../WebGLUtil";

/**
 * @description 塗りのシェーダーを実行します。
 *              Execute the fill shader.
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
): void =>
{
    // mask setting
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOpSeparate($gl.FRONT, $gl.KEEP, $gl.KEEP, $gl.INCR_WRAP);
    $gl.stencilOpSeparate($gl.BACK,  $gl.KEEP, $gl.KEEP, $gl.DECR_WRAP);
    $gl.colorMask(false, false, false, false);

    $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);

    const useGrid = !!grid_data;
    const coverageShader = variantsShapeMaskShaderService(false, useGrid);
    if (grid_data) {
        shaderManagerSetMaskUniformService(coverageShader, grid_data);
    }
    shaderManagerFillUseCase(
        coverageShader, vertex_array_object, offset, index_count
    );
    $gl.disable($gl.SAMPLE_ALPHA_TO_COVERAGE);

    // draw shape setting
    $gl.stencilFunc($gl.NOTEQUAL, 0, 0xff);
    $gl.stencilOp($gl.KEEP, $gl.ZERO, $gl.ZERO);
    $gl.colorMask(true, true, true, true);

    const shaderManager = variantsShapeSolidColorShaderService(false, useGrid);
    if (grid_data) {
        shaderManagerSetFillUniformService(shaderManager, grid_data);
    }
    shaderManagerFillUseCase(
        shaderManager, vertex_array_object, offset, index_count
    );
};