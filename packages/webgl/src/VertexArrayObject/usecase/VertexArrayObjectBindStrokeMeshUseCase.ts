import type { IPath } from "../../interface/IPath";
import type { IStrokeVertexArrayObject } from "../../interface/IStrokeVertexArrayObject";
import { execute as meshStrokeGenerateUseCase } from "../../Mesh/usecase/MeshStrokeGenerateUseCase";
import { execute as vertexArrayObjectGetStrokeObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectGetStrokeObjectUseCase";
import { execute as vertexArrayObjectBindService } from "../../VertexArrayObject/service/VertexArrayObjectBindService";
import {
    $gl,
    $upperPowerOfTwo
} from "../../WebGLUtil";

/**
 * @description ストロークメッシュを生成してバインド
 *              Generate and bind stroke mesh
 *
 * @param  {IPath[]} vertices
 * @return {IStrokeVertexArrayObject}
 * @method
 * @protected
 */
export const execute = (vertices: IPath[]): IStrokeVertexArrayObject =>
{
    const strokeMesh = meshStrokeGenerateUseCase(vertices);

    const vertexArrayObject = vertexArrayObjectGetStrokeObjectUseCase();
    vertexArrayObjectBindService(vertexArrayObject);

    const vertexBufferData = strokeMesh.vertexBufferData;
    $gl.bindBuffer($gl.ARRAY_BUFFER, vertexArrayObject.vertexBuffer);
    if (vertexArrayObject.vertexLength < vertexBufferData.length) {
        vertexArrayObject.vertexLength = $upperPowerOfTwo(vertexBufferData.length);
        $gl.bufferData($gl.ARRAY_BUFFER, vertexArrayObject.vertexLength * 4, $gl.DYNAMIC_DRAW);
    }
    $gl.bufferSubData($gl.ARRAY_BUFFER, 0, vertexBufferData);

    const indexBufferData = strokeMesh.indexBufferData;
    $gl.bindBuffer($gl.ELEMENT_ARRAY_BUFFER, vertexArrayObject.indexBuffer);
    if (vertexArrayObject.indexLength < indexBufferData.length) {
        vertexArrayObject.indexLength = $upperPowerOfTwo(indexBufferData.length);
        $gl.bufferData($gl.ELEMENT_ARRAY_BUFFER, vertexArrayObject.indexLength * 2, $gl.DYNAMIC_DRAW);
    }
    $gl.bufferSubData($gl.ELEMENT_ARRAY_BUFFER, 0, indexBufferData);

    vertexArrayObject.indexCount = indexBufferData.length;
    return vertexArrayObject;
};