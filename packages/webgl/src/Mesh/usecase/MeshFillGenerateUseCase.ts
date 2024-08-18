import type { IPath } from "../../interface/IPath";
import type { IIndexRange } from "../../interface/IIndexRange";
import type { IFillMesh } from "../../interface/IFillMesh";
import { $objectPool } from "../../Mesh";
import { $getArray } from "../../WebGLUtil";
import { execute as meshFillGenerateService } from "../service/MeshFillGenerateService";

/**
 * @description 塗りのメッシュを生成する
 *              Generate a fill mesh
 * 
 * @param  {IPath[]} vertices
 * @return {IFillMesh}
 * @method
 * @protected
 */
export const execute = (vertices: IPath[]): IFillMesh =>
{
    let length = 0;
    for (let idx = 0; idx < vertices.length; ++idx) {
        length += (vertices[idx].length / 3 - 2) * 12;
    }

    const buffer = new Float32Array(length);
    const indexRanges: IIndexRange[] = $getArray();

    let currentIndex = 0;
    for (let idx = 0; idx < vertices.length; ++idx) {

        const first = currentIndex;
        currentIndex = meshFillGenerateService(vertices[idx], buffer, currentIndex);
        const count = currentIndex - first;

        const indexRange = $objectPool.pop() || { "first": 0, "count": 0 };
        indexRange.first = first;
        indexRange.count = count;
        indexRanges.push(indexRange);
    }

    return {
        "buffer": buffer,
        "indexRanges": indexRanges
    };
};