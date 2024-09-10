import type { IPath } from "../../interface/IPath";
import type { IFillMesh } from "../../interface/IFillMesh";
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
        length += (vertices[idx].length / 3 - 2) * 51;
    }

    const buffer = new Float32Array(length);

    let currentIndex = 0;
    for (let idx = 0; idx < vertices.length; ++idx) {
        currentIndex = meshFillGenerateService(vertices[idx], buffer, currentIndex);
    }

    return {
        "buffer": buffer,
        "indexCount": currentIndex
    };
};