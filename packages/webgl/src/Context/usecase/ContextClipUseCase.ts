import { $getVertices } from "../../PathCommand";
import { execute as vertexArrayObjectCreateFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";

/**
 * @description Contextのパスコマンドのマスク描画を実行します。
 *              Execute Context path command mask drawing.
 *
 * @param  {boolean} has_grid
 * @return {void}
 * @method
 * @protected
 */
export const execute = (has_grid: boolean): void =>
{
    const vertices = $getVertices();
    if (!vertices.length) {
        return ;
    }

    const vertexArrayObject = vertexArrayObjectCreateFillObjectUseCase(vertices);
    const shaderManager = variantsShapeMaskShaderService(false, has_grid);
    shaderManagerSetMaskUniformService(shaderManager, has_grid);
    shaderManagerFillUseCase(shaderManager, vertexArrayObject);

    // release vertex array
    vertexArrayObjectReleaseVertexArrayObjectService(vertexArrayObject);
};