import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { execute as variantsShapeRectShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeRectShaderService";
import { $getRectVertexArrayObject } from "../../VertexArrayObject";
import {
    $gl,
    $context
} from "../../WebGLUtil";

/**
 * @description マスクの合成処理
 *              Mask synthesis processing
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

    // レベル以上のステンシルバッファをマージ
    const mask = 1 << currentAttachmentObject.clipLevel - 1;
    $gl.stencilMask(~mask - 1);
    $gl.stencilFunc($gl.LEQUAL, mask, 0xff);
    $gl.stencilOp($gl.ZERO, $gl.REPLACE, $gl.REPLACE);
    shaderManagerFillUseCase(
        variantsShapeRectShaderService(),
        $getRectVertexArrayObject(),
        0, 6
    );

    // レベル以上のステンシルバッファをクリア
    $gl.stencilMask(1 << currentAttachmentObject.clipLevel);
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOp($gl.REPLACE, $gl.REPLACE, $gl.REPLACE);
    shaderManagerFillUseCase(
        variantsShapeRectShaderService(),
        $getRectVertexArrayObject(),
        0, 6
    );

    // base mask setting
    $gl.stencilMask(0xff);
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOpSeparate($gl.FRONT, $gl.KEEP, $gl.KEEP, $gl.INCR_WRAP);
    $gl.stencilOpSeparate($gl.BACK,  $gl.KEEP, $gl.KEEP, $gl.DECR_WRAP);
};