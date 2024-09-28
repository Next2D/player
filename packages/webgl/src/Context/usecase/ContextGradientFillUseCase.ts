import type { ShaderManager } from "../../Shader/ShaderManager";
import { $getVertices } from "../../PathCommand";
import { execute as gradientLUTGenerateShapeTextureUseCase } from "../../Shader/GradientLUTGenerator/usecase/GradientLUTGenerateShapeTextureUseCase";
import { execute as variantsGradientShapeShaderUseCase } from "../../Shader/Variants/Gradient/usecase/VariantsGradientShapeShaderUseCase";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { execute as vertexArrayObjectCreateFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetGradientFillUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetGradientFillUniformService";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import {
    $gl,
    $context,
    $inverseMatrix,
    $linearGradientXY,
    $poolFloat32Array6,
    $poolFloat32Array4
} from "../../WebGLUtil";

/**
 * @description グラデーション塗りを描画
 *              Draw a gradient fill
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
            false, false, false, spread
        );

        const points = $linearGradientXY(matrix);
        
        const inverseMatrix = $inverseMatrix($context.$matrix);
        shaderManagerSetGradientFillUniformService(
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
            false, true, Boolean(focal), spread
        );

        const prevMatrix = $context.$stack[$context.$stack.length - 1];

        const inverseMatrix = $inverseMatrix($context.$matrix);
        shaderManagerSetGradientFillUniformService(
            shaderManager, type, prevMatrix,
            inverseMatrix, focal
        );

        $context.restore();

        $poolFloat32Array6(inverseMatrix);
    }

    const vertexArrayObject = vertexArrayObjectCreateFillObjectUseCase(vertices);

    // mask on
    $gl.enable($gl.STENCIL_TEST);
    $gl.stencilMask(0xff);

    // draw shape
    $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOp($gl.KEEP, $gl.INVERT, $gl.INVERT);
    $gl.colorMask(false, false, false, false);

    const coverageShader = variantsShapeMaskShaderService(false);
    shaderManagerSetMaskUniformService(coverageShader);
    shaderManagerFillUseCase(coverageShader, vertexArrayObject);
    $gl.disable($gl.SAMPLE_ALPHA_TO_COVERAGE);

    // draw shape range
    $gl.stencilFunc($gl.NOTEQUAL, 0, 0xff);
    $gl.stencilOp($gl.KEEP, $gl.ZERO, $gl.ZERO);
    $gl.colorMask(true, true, true, true);
    shaderManagerFillUseCase(shaderManager as ShaderManager, vertexArrayObject);

    // mask off
    $gl.disable($gl.STENCIL_TEST);

    // release vertex array
    vertexArrayObjectReleaseVertexArrayObjectService(vertexArrayObject);
};