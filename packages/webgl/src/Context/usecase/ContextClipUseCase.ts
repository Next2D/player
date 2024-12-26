import { execute as vertexArrayObjectCreateFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { execute as variantsShapeRectShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeRectShaderService";
import { $getRectVertexArrayObject } from "../../VertexArrayObject";
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

    const vertexArrayObject = vertexArrayObjectCreateFillObjectUseCase();

    let level  = currentAttachmentObject.clipLevel || 1;
    let offset = 0;
    let gridData: Float32Array | null = null;

    const length = $fillBufferIndexes.length;
    for (let idx = 0; idx < length; idx++) {

        const indexCount = $fillBufferIndexes[idx];

        if ($gridDataMap.has(idx)) {
            gridData = $gridDataMap.get(idx) as Float32Array | null;
        }
        const useGrid = !!gridData;

        if ($context.containerClip) {
            $gl.stencilMask(1 << level - 1);
        }

        const shaderManager = variantsShapeMaskShaderService(useGrid);
        if (gridData) {
            shaderManagerSetMaskUniformService(shaderManager, gridData);
        }
        shaderManagerFillUseCase(
            shaderManager, vertexArrayObject, offset, indexCount
        );

        offset += indexCount;

        if (!$context.containerClip) {
            continue;
        }

        if (length - 1 > idx) {
            ++level;
        }

        if (level > 7) {

            // 例として level=4 の場合
            //
            // ステンシルバッファの4ビット目以上を4ビット目に統合する。
            //   |?|?|?|?|?|*|*|*|  ->  | | | | |?|*|*|*|
            //
            // このとき、4ビット目以上に1のビットが1つでもあれば4ビット目を1、
            // そうでなければ4ビット目を0とする。
            //
            //   00000***  ->  00000***
            //   00001***  ->  00001***
            //   00010***  ->  00001***
            //   00011***  ->  00001***
            //   00100***  ->  00001***
            //    ...
            //   11101***  ->  00001***
            //   11110***  ->  00001***
            //   11111***  ->  00001***
            //
            // したがってステンシルの現在の値を 00001000 と比較すればよい。
            // 比較して 00001000 以上であれば 00001*** で更新し、そうでなければ 00000*** で更新する。
            // 下位3ビットは元の値を保持する必要があるので 11111000 でマスクする。

            const mask = 1 << level - 1;
            $gl.stencilMask(~(mask - 1));
            $gl.stencilFunc($gl.LEQUAL, 0, 0xff);
            $gl.stencilOp($gl.ZERO, $gl.REPLACE, $gl.REPLACE);

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
        }
    }

    if ($context.containerClip) {
        const mask = 1 << level - 1;
        $gl.stencilMask(~(mask - 1));
        $gl.stencilFunc($gl.LEQUAL, 0, 0xff);
        $gl.stencilOp($gl.ZERO, $gl.REPLACE, $gl.REPLACE);

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
    }

    // release vertex array
    vertexArrayObjectReleaseVertexArrayObjectService(vertexArrayObject);

    // clear fill buffer setting
    $clearFillBufferSetting();
    $terminateGrid();
};