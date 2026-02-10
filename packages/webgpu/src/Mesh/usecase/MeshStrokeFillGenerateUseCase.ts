import type { IPath } from "../../interface/IPath";
import type { IMeshResult } from "../../interface/IMeshResult";
import { execute as meshStrokeFillGenerateService } from "../service/MeshStrokeFillGenerateService";

/**
 * @description メッシュ生成用の再利用可能な一時バッファ（GC回避）
 */
let $meshTempBuffer: Float32Array = new Float32Array(32);

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
 * @description ストローク塗りつぶし用のメッシュを生成する
 *              Generate a stroke fill mesh
 *
 * 頂点フォーマット（4 floats per vertex）:
 * - position: x, y (2 floats)
 * - bezier: u, v (2 floats) - 常に (0.5, 0.5)
 *
 * color/matrixはuniform bufferで供給される
 *
 * @param  {IPath[]} vertices
 * @return {IMeshResult}
 * @method
 * @protected
 */
export const execute = (
    vertices: IPath[]
): IMeshResult => {

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
        index = meshStrokeFillGenerateService(
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
