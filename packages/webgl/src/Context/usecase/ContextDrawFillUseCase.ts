import { execute as vertexArrayObjectCreateFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as variantsShapeSolidColorShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeSolidColorShaderService";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetFillUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetFillUniformService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { $gl } from "../../WebGLUtil";
import {
    $terminateGrid,
    $gridDataMap
} from "../../Grid";
import {
    $fillBufferIndexes,
    $fillTypes,
    $clearFillBufferSetting
} from "../../Mesh";

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
    const vertexArrayObject = vertexArrayObjectCreateFillObjectUseCase();

    // mask on
    $gl.enable($gl.STENCIL_TEST);
    $gl.frontFace($gl.CCW);
    $gl.stencilMask(0xff);

    let offset = 0;
    let useGrid: boolean = false;
    let gridData: Float32Array | null = null;
    for (let idx = 0; idx < $fillBufferIndexes.length; idx++) {

        const indexCount = $fillBufferIndexes[idx];

        if ($gridDataMap.has(idx)) {
            gridData = $gridDataMap.get(idx) as Float32Array | null;
            useGrid  = !!gridData;
        }

        // mask setting
        $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
        $gl.stencilOpSeparate($gl.FRONT, $gl.KEEP, $gl.KEEP, $gl.INCR_WRAP);
        $gl.stencilOpSeparate($gl.BACK,  $gl.KEEP, $gl.KEEP, $gl.DECR_WRAP);
        $gl.colorMask(false, false, false, false);

        $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);

        const coverageShader = variantsShapeMaskShaderService(false, useGrid);
        if (gridData) {
            shaderManagerSetMaskUniformService(coverageShader, gridData);
        }
        shaderManagerFillUseCase(
            coverageShader, vertexArrayObject, offset, indexCount
        );
        $gl.disable($gl.SAMPLE_ALPHA_TO_COVERAGE);

        // draw shape setting
        $gl.stencilFunc($gl.NOTEQUAL, 0, 0xff);
        $gl.stencilOp($gl.KEEP, $gl.ZERO, $gl.ZERO);
        $gl.colorMask(true, true, true, true);

        const type = $fillTypes[idx];
        switch (type) {

            case "fill":
                {
                    const shaderManager = variantsShapeSolidColorShaderService(false, useGrid);
                    if (gridData) {
                        shaderManagerSetFillUniformService(shaderManager, gridData);
                    }
                    shaderManagerFillUseCase(
                        shaderManager, vertexArrayObject, offset, indexCount
                    );
                }
                break;

            case "gradient":
                break;

            case "pattern":
                break;

        }

        offset += indexCount;
    }

    // mask off
    $gl.disable($gl.STENCIL_TEST);

    // release vertex array
    vertexArrayObjectReleaseVertexArrayObjectService(vertexArrayObject);

    // 設定値を初期化
    $clearFillBufferSetting();
    $terminateGrid();
};