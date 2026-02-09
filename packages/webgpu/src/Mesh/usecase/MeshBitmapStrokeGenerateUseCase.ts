import type { IPath } from "../../interface/IPath";
import type { IMeshResult } from "../../interface/IMeshResult";
import { generateStrokeOutline } from "./MeshStrokeGenerateUseCase";
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
 * @description ビットマップストローク用のメッシュを生成する
 *              Generate a mesh for bitmap stroke
 *
 * @param  {IPath[]} vertices
 * @param  {number} thickness
 * @return {IMeshResult}
 * @method
 * @protected
 */
export const execute = (
    vertices: IPath[],
    thickness: number
): IMeshResult => {

    const halfThickness = thickness / 2;

    // 各パスのアウトラインを生成
    const fillVertices: IPath[] = [];
    for (const path of vertices) {
        const outlines = generateStrokeOutline(path, halfThickness);
        for (const outline of outlines) {
            fillVertices.push(outline);
        }
    }

    // 頂点数を計算（各パスの三角形数 × 3）
    let totalVertices = 0;
    for (const vertex of fillVertices) {
        const length = vertex.length - 5;
        for (let idx = 3; idx < length; idx += 3) {
            totalVertices += 3;
        }
    }

    if (totalVertices === 0) {
        return {
            "buffer": new Float32Array(0),
            "indexCount": 0
        };
    }

    // バッファを確保（4 floats per vertex、再利用可能バッファ）
    const requiredSize = totalVertices * 4;
    if ($meshTempBuffer.length < requiredSize) {
        $meshTempBuffer = new Float32Array($upperPowerOfTwo(requiredSize));
    }
    const buffer = $meshTempBuffer;

    let index = 0;
    for (const vertex of fillVertices) {
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
