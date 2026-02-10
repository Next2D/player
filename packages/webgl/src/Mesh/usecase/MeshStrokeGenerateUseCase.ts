import type { IFillMesh } from "../../interface/IFillMesh";
import type { IPath } from "../../interface/IPath";
import { execute as meshGenerateStrokeOutlineUseCase } from "./MeshGenerateStrokeOutlineUseCase";
import { execute as meshFillGenerateUseCase } from "./MeshFillGenerateUseCase";
import { $context, $getArray, $poolArray } from "../../WebGLUtil";

/**
 * @description ストロークのメッシュを生成
 *              Generate a stroke mesh
 *
 * @param  {IPath[]} vertices
 * @return {IFillMesh}
 * @method
 * @protected
 */
export const execute = (vertices: IPath[]): IFillMesh =>
{
    const thickness = $context.thickness / 2;

    // プールから配列を取得して再利用
    const fillVertices: IPath[] = $getArray();
    for (let idx = 0; idx < vertices.length; ++idx) {
        const vertex = meshGenerateStrokeOutlineUseCase(vertices[idx], thickness);
        // スプレッド演算子の代わりにループで追加（より効率的）
        for (let i = 0; i < vertex.length; ++i) {
            fillVertices.push(vertex[i]);
        }
    }

    const result = meshFillGenerateUseCase(fillVertices, "stroke");

    // 配列をプールに戻す
    fillVertices.length = 0;
    $poolArray(fillVertices);

    return result;
};