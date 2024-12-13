import { $getVertices } from "../../PathCommand";
import { execute as vertexArrayObjectCreateFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as variantsShapeSolidColorShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeSolidColorShaderService";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetFillUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetFillUniformService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { $gl } from "../../WebGLUtil";

/**
 * @description Contextのパスコマンドの塗り実行します。
 *              Execute Context path command painting.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const vertices = $getVertices();
    if (!vertices.length) {
        return ;
    }

    const vertexArrayObject = vertexArrayObjectCreateFillObjectUseCase(vertices);

    // mask on
    $gl.enable($gl.STENCIL_TEST);
    $gl.stencilMask(0xff);
    $gl.frontFace($gl.CCW);

    // mask setting
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOpSeparate($gl.FRONT, $gl.KEEP, $gl.KEEP, $gl.INCR_WRAP);
    $gl.stencilOpSeparate($gl.BACK,  $gl.KEEP, $gl.KEEP, $gl.DECR_WRAP);
    $gl.colorMask(false, false, false, false);

    $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    const coverageShader = variantsShapeMaskShaderService(false);
    shaderManagerSetMaskUniformService(coverageShader);
    shaderManagerFillUseCase(coverageShader, vertexArrayObject);
    $gl.disable($gl.SAMPLE_ALPHA_TO_COVERAGE);

    // draw shape setting
    $gl.stencilFunc($gl.NOTEQUAL, 0, 0xff);
    $gl.stencilOp($gl.KEEP, $gl.ZERO, $gl.ZERO);
    $gl.colorMask(true, true, true, true);

    const shaderManager = variantsShapeSolidColorShaderService(false);
    shaderManagerSetFillUniformService(shaderManager);
    shaderManagerFillUseCase(shaderManager, vertexArrayObject);

    // mask off
    $gl.disable($gl.STENCIL_TEST);

    // release vertex array
    vertexArrayObjectReleaseVertexArrayObjectService(vertexArrayObject);
};