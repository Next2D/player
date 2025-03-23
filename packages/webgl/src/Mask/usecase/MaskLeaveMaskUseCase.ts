import { execute as maskEndMaskService } from "../service/MaskEndMaskService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { execute as variantsShapeRectShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeRectShaderService";
import { $getRectVertexArrayObject } from "../../VertexArrayObject";
import {
    $setMaskDrawing,
    $clipBounds,
    $clipLevels
} from "../../Mask";
import {
    $gl,
    $context,
    $poolFloat32Array4
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

    const clipLevel = currentAttachmentObject.clipLevel;
    const bounds = $clipBounds.get(clipLevel) as Float32Array;
    const xMin = bounds[0];
    const yMin = bounds[1];
    const xMax = bounds[2];
    const yMax = bounds[3];

    // レベルと描画範囲を削除
    $clipBounds.delete(clipLevel);
    $clipLevels.delete(clipLevel);
    $poolFloat32Array4(bounds);

    const width  = Math.ceil(Math.abs(xMax - xMin));
    const height = Math.ceil(Math.abs(yMax - yMin));
    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(
        xMin,
        currentAttachmentObject.height - yMin - height,
        width,
        height
    );

    // 単体のマスクであれば終了
    --currentAttachmentObject.clipLevel;
    if (!currentAttachmentObject.clipLevel) {
        currentAttachmentObject.mask = false;
        $setMaskDrawing(false);

        $gl.clear($gl.STENCIL_BUFFER_BIT);
        $gl.disable($gl.STENCIL_TEST);
        $gl.disable($gl.SCISSOR_TEST);

        $clipLevels.clear();
        $clipBounds.clear();
        return ;
    }

    // 上位レベルのステンシルバッファをクリア
    $gl.stencilMask(1 << currentAttachmentObject.clipLevel);
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOp($gl.REPLACE, $gl.REPLACE, $gl.REPLACE);
    $gl.colorMask(false, false, false, false);

    shaderManagerFillUseCase(
        variantsShapeRectShaderService(),
        $getRectVertexArrayObject(),
        0, 6
    );

    maskEndMaskService();
};