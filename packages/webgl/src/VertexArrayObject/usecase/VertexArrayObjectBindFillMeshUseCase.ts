import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { execute as vertexArrayObjectGetFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectGetFillObjectUseCase";
import { execute as vertexArrayObjectBindService } from "../../VertexArrayObject/service/VertexArrayObjectBindService";
import {
    $getFillBuffer,
    $getFillBufferOffset
} from "../../Mesh";
import {
    $gl,
    $upperPowerOfTwo
} from "../../WebGLUtil";

/**
 * @description 塗りのコマンドからメッシュを生成して、VertexArrayにバインドする
 *              Generate a mesh from the fill command and bind it to the VertexArray
 *
 * @return {IVertexArrayObject}
 * @method
 * @protected
 */
export const execute = (): IVertexArrayObject =>
{
    const vertexArrayObject = vertexArrayObjectGetFillObjectUseCase();
    vertexArrayObjectBindService(vertexArrayObject);

    const buffer = $getFillBuffer();
    const offset = $getFillBufferOffset();

    $gl.bindBuffer($gl.ARRAY_BUFFER, vertexArrayObject.vertexBuffer);
    if (vertexArrayObject.vertexLength < buffer.length) {
        vertexArrayObject.vertexLength = $upperPowerOfTwo(buffer.length);
        // STREAM_DRAW: 毎フレーム更新されるデータに最適
        // STREAM_DRAW: Optimal for data updated every frame
        $gl.bufferData($gl.ARRAY_BUFFER, vertexArrayObject.vertexLength * 4, $gl.STREAM_DRAW);
    }

    $gl.bufferSubData($gl.ARRAY_BUFFER, 0, buffer.subarray(0, offset));

    return vertexArrayObject;
};