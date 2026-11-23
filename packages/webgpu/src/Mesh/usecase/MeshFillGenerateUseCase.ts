import type { IPath } from "../../interface/IPath";
import type { IMeshResult } from "../../interface/IMeshResult";
import { execute as meshFillGenerateService } from "../service/MeshFillGenerateService";
import {
    $nativeShape,
    $nativeFillSize,
    $NATIVE_FILL_PATH
} from "../../NativeShape";

/**
 * @description メッシュ生成用の再利用可能な一時バッファ（GC回避）
 */
let $meshTempBuffer: Float32Array = new Float32Array(32);

/**
 * @description 2のべき乗に切り上げる
 *              Round up to the next power of two
 *
 * @param  {number} v - 切り上げ対象の値 / Value to round up
 * @return {number} 2のべき乗の値 / Next power of two
 */
const $upperPowerOfTwo = (v: number): number =>
{
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
};

/**
 * @description 塗りのメッシュを生成する
 *              Generate a fill mesh
 *
 * @param  {IPath[]} vertices - パス頂点配列 / Array of path vertices
 * @return {IMeshResult} メッシュ結果 / Mesh result
 * @method
 * @protected
 */
export const execute = (
    vertices: IPath[]
): IMeshResult => {

    // 経路が実行環境の側にあるときは、メッシュもそちらで作る
    if (vertices === $NATIVE_FILL_PATH && $nativeShape) {
        if ($meshTempBuffer.length < $nativeFillSize) {
            $meshTempBuffer = new Float32Array($upperPowerOfTwo($nativeFillSize));
        }
        const indexCount = $nativeShape.fill($meshTempBuffer);
        return {
            "buffer": $meshTempBuffer.subarray(0, indexCount * 4),
            "indexCount": indexCount
        };
    }

    // 頂点数を計算（各パスの三角形数 × 3）
    let totalVertices = 0;
    for (const vertex of vertices) {
        const length = vertex.length - 5;
        for (let idx = 3; idx < length; idx += 3) {
            totalVertices += 3;
        }
    }

    // バッファを確保（4 floats per vertex、再利用可能バッファ）
    const requiredSize = totalVertices * 4;
    if ($meshTempBuffer.length < requiredSize) {
        $meshTempBuffer = new Float32Array($upperPowerOfTwo(requiredSize));
    }
    const buffer = $meshTempBuffer;

    let index = 0;
    for (const vertex of vertices) {
        index = meshFillGenerateService(
            vertex,
            buffer,
            index
        );
    }

    return {
        "buffer": buffer.subarray(0, index * 4),
        "indexCount": index
    };
};
