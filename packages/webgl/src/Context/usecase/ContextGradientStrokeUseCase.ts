import type { ShaderManager } from "../../Shader/ShaderManager";
import { $getVertices } from "../../PathCommand";
import { execute as gradientLUTGenerateShapeTextureUseCase } from "../../Shader/GradientLUTGenerator/usecase/GradientLUTGenerateShapeTextureUseCase";
import { execute as vertexArrayObjectBindStrokeMeshUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindStrokeMeshUseCase";
import { execute as variantsGradientShapeShaderUseCase } from "../../Shader/Variants/Gradient/usecase/VariantsGradientShapeShaderUseCase";
import { execute as shaderManagerSetGradientStrokeUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetGradientStrokeUniformService";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as vertexArrayObjectReleaseStrokeVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseStrokeVertexArrayObjectService";
import { execute as shaderManagerStrokeUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerStrokeUseCase";
import {
    $context,
    $inverseMatrix,
    $linearGradientXY,
    $poolFloat32Array6,
    $poolFloat32Array4
} from "../../WebGLUtil";

/**
 * @description 線のグラデーションを実行
 *              Execute gradient of line
 *
 * @param  {number} type 
 * @param  {array} stops 
 * @param  {Float32Array} matrix 
 * @param  {number} spread 
 * @param  {number} interpolation 
 * @param  {number} focal 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    type: number, 
    stops: number[], 
    matrix: Float32Array, 
    spread: number, 
    interpolation: number, 
    focal: number
): void => {

    const vertices = $getVertices();
    if (!vertices.length) {
        return ;
    }

    const textureObject = gradientLUTGenerateShapeTextureUseCase(stops, interpolation);
    textureManagerBind0UseCase(textureObject);

    let shaderManager: ShaderManager | null= null;
    if (type === 0) { // linear
        shaderManager = variantsGradientShapeShaderUseCase(
            true, false, false, spread
        );

        const points = $linearGradientXY(matrix);
        
        const inverseMatrix = $inverseMatrix($context.$matrix);
        shaderManagerSetGradientStrokeUniformService(
            shaderManager, type, $context.$matrix,
            inverseMatrix, 0, points
        );

        $poolFloat32Array4(points);
        $poolFloat32Array6(inverseMatrix);
    } else { // radial

        $context.save();
        $context.transform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );

        shaderManager = variantsGradientShapeShaderUseCase(
            true, true, Boolean(focal), spread
        );

        const prevMatrix = $context.$stack[$context.$stack.length - 1];

        const inverseMatrix = $inverseMatrix($context.$matrix);
        shaderManagerSetGradientStrokeUniformService(
            shaderManager, type, prevMatrix,
            inverseMatrix, focal
        );

        $context.restore();

        $poolFloat32Array6(inverseMatrix);
    }

    const vertexArrayObject = vertexArrayObjectBindStrokeMeshUseCase(vertices);

    shaderManagerStrokeUseCase(
        shaderManager,
        vertexArrayObject
    );

    vertexArrayObjectReleaseStrokeVertexArrayObjectService(vertexArrayObject);
};