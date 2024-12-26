import type { IFillMesh } from "../../interface/IFillMesh";
import type { IPath } from "../../interface/IPath";
import { execute as meshGenerateStrokeOutlineUseCase } from "./MeshGenerateStrokeOutlineUseCase";
import { execute as meshFillGenerateUseCase } from "./MeshFillGenerateUseCase";
import { $context } from "../../WebGLUtil";

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

    const fillVertices: IPath[] = [];
    for (let idx = 0; idx < vertices.length; ++idx) {
        const vertex = meshGenerateStrokeOutlineUseCase(vertices[idx], thickness);
        fillVertices.push(...vertex);
    }

    return meshFillGenerateUseCase(fillVertices, "stroke");
};