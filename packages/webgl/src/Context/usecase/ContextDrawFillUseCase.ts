import { execute as vertexArrayObjectBindFillMeshUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as contextNormalFillUseCase } from "./ContextNormalFillUseCase";
import { execute as contextNormalFillRunUseCase } from "./ContextNormalFillRunUseCase";
import { execute as contextLinearGradientFillUseCase } from "./ContextLinearGradientFillUseCase";
import { execute as contextRadialGradientFillUseCase } from "./ContextRadialGradientFillUseCase";
import { execute as contextPatternBitmapFillUseCase } from "./ContextPatternBitmapFillUseCase";
import { execute as stencilResetService } from "../../Stencil/service/StencilResetService";
import { execute as gradientLUTPrepareShapeTexturesUseCase } from "../../Shader/GradientLUTGenerator/usecase/GradientLUTPrepareShapeTexturesUseCase";
import { $gradientData } from "../../Gradient";
import {
    $gl,
    $nativeSolidFills,
    $enableStencilTest,
    $disableStencilTest
} from "../../WebGLUtil";
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
 * @description まとめて実行する塗りの、塗りごとの頂点数 (足りなくなったら広げる)
 *              Vertex counts of the fills executed in one run (grown when it runs short)
 *
 * @type {Int32Array}
 * @private
 */
let $runCounts: Int32Array = new Int32Array(256);

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

    // mask on（frontFaceはContext初期化時にCCW固定）
    $enableStencilTest();
    $gl.stencilMask(0xff);

    // Reset stencil cache at the start of fill processing
    stencilResetService();

    // グラデーションの LUT は、塗りごとではなく、ここでまとめて先に描く
    // (LUT を描いた場合はステンシルテストが無効になっているので、戻す)
    if ($gradientData.length && gradientLUTPrepareShapeTexturesUseCase()) {
        $enableStencilTest();
        $gl.stencilMask(0xff);
        stencilResetService();
    }

    let fillOffset = 0;
    let gridData: Float32Array | null = null;
    for (let idx = 0; idx < $fillTypes.length; idx++) {

        if ($gridDataMap.has(idx)) {
            gridData = $gridDataMap.get(idx) as Float32Array | null;
        }

        const type = $fillTypes[idx];
        switch (type) {

            case "fill": // 通常のShapeの塗り
                if ($nativeSolidFills && !gridData) {
                    // 単色の塗りが続く範囲 (9スライスの設定が変わる手前まで) を、まとめて実行する
                    let length = 0;
                    let total  = 0;
                    for (;;) {
                        const count = $fillBufferIndexes.shift() as number;
                        if (length === $runCounts.length) {
                            const counts = new Int32Array(length * 2);
                            counts.set($runCounts);
                            $runCounts = counts;
                        }
                        $runCounts[length++] = count;
                        total += count;

                        const next = idx + 1;
                        if (next >= $fillTypes.length
                            || $fillTypes[next] !== "fill"
                            || $gridDataMap.has(next)
                        ) {
                            break;
                        }
                        idx = next;
                    }
                    contextNormalFillRunUseCase(
                        fillVertexArrayObject, fillOffset, $runCounts, length
                    );
                    fillOffset += total;
                } else {
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
    $disableStencilTest();

    // Reset stencil cache after disabling stencil test
    stencilResetService();

    // release vertex array
    vertexArrayObjectReleaseVertexArrayObjectService(fillVertexArrayObject);

    // 設定値を初期化
    $clearFillBufferSetting();
    $terminateGrid();
};