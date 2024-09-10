import type { IPath } from "../../interface/IPath";
import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { execute as vertexArrayObjectGetFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectGetFillObjectUseCase";
import { execute as vertexArrayObjectBindService } from "../../VertexArrayObject/service/VertexArrayObjectBindService";
import {
    $gl,
    $upperPowerOfTwo
} from "../../WebGLUtil";

/**
 * @description 塗りのコマンドからメッシュを生成して、VertexArrayにバインドする
 *              Generate a mesh from the fill command and bind it to the VertexArray
 *
 * @param  {IPath[]} vertices
 * @return {IVertexArrayObject}
 * @method
 * @protected
 */
export const execute = (vertices: IPath[]): IVertexArrayObject =>
{
    const fillMesh = meshFillGenerateUseCase(vertices);

    const vertexArrayObject = vertexArrayObjectGetFillObjectUseCase();
    vertexArrayObjectBindService(vertexArrayObject);

    $gl.bindBuffer($gl.ARRAY_BUFFER, vertexArrayObject.vertexBuffer);
    if (vertexArrayObject.vertexLength < fillMesh.buffer.length) {
        vertexArrayObject.vertexLength = $upperPowerOfTwo(fillMesh.buffer.length);
        $gl.bufferData($gl.ARRAY_BUFFER, vertexArrayObject.vertexLength * 4, $gl.DYNAMIC_DRAW);
    }

    $gl.bufferSubData($gl.ARRAY_BUFFER, 0, fillMesh.buffer);

    vertexArrayObject.indexCount = fillMesh.indexCount;
    return vertexArrayObject;
};