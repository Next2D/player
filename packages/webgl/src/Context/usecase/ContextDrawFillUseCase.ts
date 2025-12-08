import { execute as vertexArrayObjectBindFillMeshUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as contextNormalFillUseCase } from "./ContextNormalFillUseCase";
import { execute as contextLinearGradientFillUseCase } from "./ContextLinearGradientFillUseCase";
import { execute as contextRadialGradientFillUseCase } from "./ContextRadialGradientFillUseCase";
import { execute as contextPatternBitmapFillUseCase } from "./ContextPatternBitmapFillUseCase";
import { execute as stencilResetService } from "../../Stencil/service/StencilResetService";
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
    const fillVertexArrayObject = vertexArrayObjectBindFillMeshUseCase();

    // mask on
    $gl.enable($gl.STENCIL_TEST);
    $gl.frontFace($gl.CCW);
    $gl.stencilMask(0xff);

    // Reset stencil cache at the start of fill processing
    stencilResetService();

    let fillOffset = 0;
    let gridData: Float32Array | null = null;
    for (let idx = 0; idx < $fillTypes.length; idx++) {

        if ($gridDataMap.has(idx)) {
            gridData = $gridDataMap.get(idx) as Float32Array | null;
        }

        const type = $fillTypes[idx];
        switch (type) {

            case "fill": // 通常のShapeの塗り
                {
                    const count = $fillBufferIndexes.shift() as number;
                    contextNormalFillUseCase(
                        fillVertexArrayObject, fillOffset, count, gridData
                    );
                    fillOffset += count;
                }
                break;

            case "linear": // 線形グラデーションの塗り
                {
                    const count = $fillBufferIndexes.shift() as number;
                    contextLinearGradientFillUseCase(
                        fillVertexArrayObject, fillOffset, count, gridData
                    );
                    fillOffset += count;
                }
                break;

            case "radial": // 円形グラデーションの塗り
                {
                    const count = $fillBufferIndexes.shift() as number;
                    contextRadialGradientFillUseCase(
                        fillVertexArrayObject, fillOffset, count, gridData
                    );
                    fillOffset += count;
                }
                break;

            case "bitmap": // 画像の塗りつぶし
                {
                    const count = $fillBufferIndexes.shift() as number;
                    contextPatternBitmapFillUseCase(
                        fillVertexArrayObject, fillOffset, count, gridData
                    );
                    fillOffset += count;
                }
                break;

        }
    }

    // mask off
    $gl.disable($gl.STENCIL_TEST);

    // Reset stencil cache after disabling stencil test
    stencilResetService();

    // release vertex array
    vertexArrayObjectReleaseVertexArrayObjectService(fillVertexArrayObject);

    // 設定値を初期化
    $clearFillBufferSetting();
    $terminateGrid();
};