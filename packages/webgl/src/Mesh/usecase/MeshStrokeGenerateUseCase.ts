import type { IStrokeMesh } from "../../interface/IStrokeMesh";
import type { IPath } from "../../interface/IPath";
import { execute as meshGenerateLineSegmentUseCase } from "./MeshGenerateLineSegmentUseCase";
import { execute as meahGenerateLineJoinUseCase } from "./MeahGenerateLineJoinUseCase";
import { execute as meshGenerateLineCapUseCase } from "./MeshGenerateLineCapUseCase";
import {
    $getVertexBufferPosition,
    $setVertexBufferPosition,
    $getIndexBufferPosition,
    $setIndexBufferPosition,
    $getVertexBufferData,
    $getIndexBufferData
} from "../../Mesh";

/**
 * @description ストロークのメッシュを生成
 *              Generate a stroke mesh
 * 
 * @param  {IPath[]} vertices 
 * @return {IStrokeMesh}
 * @method
 * @protected
 */
export const execute = (vertices: IPath[]): IStrokeMesh =>
{
    // reset
    $setVertexBufferPosition(0);
    $setIndexBufferPosition(0);

    for (let idx = 0; idx < vertices.length; ++idx) {

        const vertexBeginOffset = $getVertexBufferPosition();
        meshGenerateLineSegmentUseCase(vertices[idx]);
        const vertexEndOffset = $getVertexBufferPosition();

        meahGenerateLineJoinUseCase(vertexBeginOffset, vertexEndOffset);
        meshGenerateLineCapUseCase(vertexBeginOffset, vertexEndOffset);
    }

    return {
        "vertexBufferData": $getVertexBufferData().subarray(0, $getVertexBufferPosition()),
        "indexBufferData" : $getIndexBufferData().subarray(0, $getIndexBufferPosition())
    };
};