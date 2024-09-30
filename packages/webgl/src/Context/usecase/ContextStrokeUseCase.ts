import { execute as vertexArrayObjectBindStrokeMeshUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindStrokeMeshUseCase";
import { $getVertices } from "../../PathCommand";
import { execute as variantsShapeSolidColorShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeSolidColorShaderService";
import { execute as shaderManagerSetStrokeUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetStrokeUniformService";
import { execute as vertexArrayObjectReleaseStrokeVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseStrokeVertexArrayObjectService";
import { execute as shaderManagerStrokeUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerStrokeUseCase";

/**
 * @description ストロークを描画
 *              Draw a stroke
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const vertices = $getVertices(true);
    if (!vertices.length) {
        return ;
    }

    const vertexArrayObject = vertexArrayObjectBindStrokeMeshUseCase(vertices);

    const shaderManager = variantsShapeSolidColorShaderService(true);
    shaderManagerSetStrokeUniformService(shaderManager);

    shaderManagerStrokeUseCase(
        shaderManager,
        vertexArrayObject
    );

    vertexArrayObjectReleaseStrokeVertexArrayObjectService(vertexArrayObject);
};