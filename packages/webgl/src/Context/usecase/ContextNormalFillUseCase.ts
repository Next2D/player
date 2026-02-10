import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { execute as variantsShapeSolidColorShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeSolidColorShaderService";
import { execute as shaderManagerSetFillUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetFillUniformService";
import { execute as stencilSetMaskModeService } from "../../Stencil/service/StencilSetMaskModeService";
import { execute as stencilSetFillModeService } from "../../Stencil/service/StencilSetFillModeService";
import { execute as stencilEnableSampleAlphaToCoverageService } from "../../Stencil/service/StencilEnableSampleAlphaToCoverageService";
import { execute as stencilDisableSampleAlphaToCoverageService } from "../../Stencil/service/StencilDisableSampleAlphaToCoverageService";

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
    // mask setting (cached)
    stencilSetMaskModeService();

    const useGrid = !!grid_data;
    const coverageShader = variantsShapeMaskShaderService(useGrid);
    if (grid_data) {
        shaderManagerSetMaskUniformService(coverageShader, grid_data);
    }

    stencilEnableSampleAlphaToCoverageService();
    shaderManagerFillUseCase(
        coverageShader, vertex_array_object, offset, index_count
    );
    stencilDisableSampleAlphaToCoverageService();

    // draw shape setting (cached)
    stencilSetFillModeService();

    const shaderManager = variantsShapeSolidColorShaderService(useGrid);
    if (grid_data) {
        shaderManagerSetFillUniformService(shaderManager, grid_data);
    }
    shaderManagerFillUseCase(
        shaderManager, vertex_array_object, offset, index_count
    );
};