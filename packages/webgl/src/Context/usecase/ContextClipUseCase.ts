import { execute as vertexArrayObjectCreateFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { execute as maskUnionMaskService } from "../../Mask/service/MaskUnionMaskService";
import {
    $clipLevels,
    $clipBounds
} from "../../Mask";
import {
    $gl,
    $context
} from "../../WebGLUtil";
import {
    $fillBufferIndexes,
    $clearFillBufferSetting
} from "../../Mesh";
import {
    $terminateGrid,
    $gridDataMap
} from "../../Grid";

/**
 * @description Contextのパスコマンドのマスク描画を実行します。
 *              Execute Context path command mask drawing.
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

    // レベルと描画範囲をセット
    const bounds = $clipBounds.get(currentAttachmentObject.clipLevel) as Float32Array;
    const xMin = bounds[0];
    const yMin = bounds[1];
    const xMax = bounds[2];
    const yMax = bounds[3];

    const width  = Math.ceil(Math.abs(xMax - xMin));
    const height = Math.ceil(Math.abs(yMax - yMin));
    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(
        xMin,
        currentAttachmentObject.height - yMin - height,
        width,
        height
    );

    const vertexArrayObject = vertexArrayObjectCreateFillObjectUseCase();
    let level = $clipLevels.get(currentAttachmentObject.clipLevel) as number;

    let offset = 0;
    let gridData: Float32Array | null = null;

    const length = $fillBufferIndexes.length;
    for (let idx = 0; idx < length; idx++) {

        $gl.stencilMask(1 << level - 1);

        const indexCount = $fillBufferIndexes[idx];

        if ($gridDataMap.has(idx)) {
            gridData = $gridDataMap.get(idx) as Float32Array | null;
        }
        const useGrid = !!gridData;

        const shaderManager = variantsShapeMaskShaderService(useGrid);
        if (gridData) {
            shaderManagerSetMaskUniformService(shaderManager, gridData);
        }
        shaderManagerFillUseCase(
            shaderManager, vertexArrayObject, offset, indexCount
        );

        offset += indexCount;

        ++level;
        if (level > 7) {
            maskUnionMaskService();
            level = currentAttachmentObject.clipLevel + 1;
        }
    }

    // update clip level
    $clipLevels.set(currentAttachmentObject.clipLevel, level);

    // release vertex array
    vertexArrayObjectReleaseVertexArrayObjectService(vertexArrayObject);

    // clear fill buffer setting
    $clearFillBufferSetting();
    $terminateGrid();

    $gl.disable($gl.SCISSOR_TEST);
};