import { execute as vertexArrayObjectCreateFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as contextNormalFillUseCase } from "./ContextNormalFillUseCase";
import { execute as contextLinearGradientFillUseCase } from "./ContextLinearGradientFillUseCase";
import { execute as contextRadialGradientFillUseCase } from "./ContextRadialGradientFillUseCase";
import { execute as contextPatternBitmapFillUseCase } from "./ContextPatternBitmapFillUseCase";
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
    let gridData: Float32Array | null = null;
    for (let idx = 0; idx < $fillBufferIndexes.length; idx++) {

        const indexCount = $fillBufferIndexes[idx];

        if ($gridDataMap.has(idx)) {
            gridData = $gridDataMap.get(idx) as Float32Array | null;
        }

        const type = $fillTypes[idx];
        switch (type) {

            case "fill": // 通常のShapeの塗り
                contextNormalFillUseCase(
                    vertexArrayObject, offset, indexCount, gridData
                );
                break;

            case "linear": // 線形グラデーションの塗り
                contextLinearGradientFillUseCase(
                    vertexArrayObject, offset, indexCount, gridData
                );
                break;

            case "radial": // 円形グラデーションの塗り
                contextRadialGradientFillUseCase(
                    vertexArrayObject, offset, indexCount, gridData
                );
                break;

            case "bitmap": // 画像の塗りつぶし
                contextPatternBitmapFillUseCase(
                    vertexArrayObject, offset, indexCount, gridData
                );
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