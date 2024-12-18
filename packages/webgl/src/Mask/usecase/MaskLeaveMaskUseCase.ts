import { $setMaskDrawing } from "../../Mask";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetMaskUniformIdentityService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformIdentityService";
import { execute as maskEndMaskService } from "../service/MaskEndMaskService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { $getRectVertexArrayObject } from "../../VertexArrayObject";
import {
    $gl,
    $context
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

    // 単体のマスクであれば終了
    --currentAttachmentObject.clipLevel;
    if (!currentAttachmentObject.clipLevel) {
        currentAttachmentObject.mask = false;
        $setMaskDrawing(false);

        $gl.disable($gl.STENCIL_TEST);
        $gl.clear($gl.STENCIL_BUFFER_BIT);
        return ;
    }

    // 上位レベルのステンシルバッファをクリア
    $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOp($gl.REPLACE, $gl.REPLACE, $gl.REPLACE);
    $gl.stencilMask(1 << currentAttachmentObject.clipLevel);
    $gl.colorMask(false, false, false, false);

    const shaderManager = variantsShapeMaskShaderService(false);
    shaderManagerSetMaskUniformIdentityService(
        shaderManager,
        currentAttachmentObject.width,
        currentAttachmentObject.height
    );
    shaderManagerFillUseCase(
        shaderManager, $getRectVertexArrayObject(), 0, 6
    );

    maskEndMaskService();
};