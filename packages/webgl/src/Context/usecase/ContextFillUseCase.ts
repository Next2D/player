import type { ShaderManager } from "../../Shader/ShaderManager";
import { $getVertices } from "../../PathCommand";
import { execute as vertexArrayObjectCreateFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as variantsShapeSolidColorShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeSolidColorShaderService";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetFillUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetFillUniformService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import {
    $gl,
    $context
} from "../../WebGLUtil";

/**
 * @description Contextのパスコマンドの塗り実行します。
 *              Execute Context path command painting.
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

    let shaderManager: ShaderManager | null= null;
    switch ($context.$fillType) {

        case 0: // normal fill
            shaderManager = variantsShapeSolidColorShaderService(false, has_grid);
            shaderManagerSetFillUniformService(shaderManager, has_grid);
            break;

        case 1: // gradient fill
            // todo
            break;

        case 2: // pattern fill
            // todo
            break;

        default:
            break;

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

    const coverageShader = variantsShapeMaskShaderService(false, has_grid);
    shaderManagerSetMaskUniformService(coverageShader, has_grid);
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