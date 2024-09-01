import { $setMaskDrawing } from "../../Mask";
import { execute as vertexArrayObjectCreateFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetMaskUniformIdentityService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformIdentityService";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as maskEndMaskService } from "./MaskEndMaskService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import {
    $context,
    $getArray, 
    $gl,
    $poolArray
} from "../../WebGLUtil";

/**
 * @description マスクの終了処理
 *              End mask processing
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const currentAttachmentObject = $context.currentAttachmentObject;
    if (!currentAttachmentObject) {
        return ;
    }

    --currentAttachmentObject.clipLevel;
    if (!currentAttachmentObject.clipLevel) {
        currentAttachmentObject.mask = false;
        $setMaskDrawing(false);
        $gl.disable($gl.STENCIL_TEST);
        $gl.clear($gl.STENCIL_BUFFER_BIT);
        return ;
    }
    
    // 上位レベルのステンシルバッファをクリア
    const width  = currentAttachmentObject.width;
    const height = currentAttachmentObject.height;
    const vertices = $getArray($getArray(
        0,         0,          false,
        0 + width, 0,          false,
        0 + width, 0 + height, false,
        0,         0 + height, false
    ));

    const vertexArrayObject = vertexArrayObjectCreateFillObjectUseCase(vertices);
    $poolArray(vertices.pop());
    $poolArray(vertices);

    const shaderManager = variantsShapeMaskShaderService(false, false);
    shaderManagerSetMaskUniformIdentityService(
        shaderManager, width, height
    );

    $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOp($gl.REPLACE, $gl.REPLACE, $gl.REPLACE);
    $gl.stencilMask(1 << currentAttachmentObject.clipLevel);
    $gl.colorMask(false, false, false, false);
    
    shaderManagerFillUseCase(shaderManager, vertexArrayObject);

    maskEndMaskService();

    // release vertexArrayObject
    vertexArrayObjectReleaseVertexArrayObjectService(vertexArrayObject);
};