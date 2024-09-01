import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { execute as vertexArrayObjectCreateFillObjectService } from "../service/VertexArrayObjectCreateFillObjectService";
import { execute as vertexArrayObjectBindService } from "../service/VertexArrayObjectBindService";
import { $gl } from "../../WebGLUtil";
import { $vertexBufferData } from "../../VertexArrayObject";

/**
 * @description インスタンス用の頂点配列オブジェクトを生成します。
 *              Generates a vertex array object for instances.
 * 
 * @param  {number} begin
 * @param  {number} end
 * @return {IVertexArrayObject}
 * @method
 * @protected
 */
export const execute = (begin: number, end: number): IVertexArrayObject =>
{
    const vertexArrayObject = vertexArrayObjectCreateFillObjectService();
    vertexArrayObjectBindService(vertexArrayObject);

    $gl.bindBuffer($gl.ARRAY_BUFFER, vertexArrayObject.vertexBuffer);

    $vertexBufferData[0] = begin;
    $vertexBufferData[2] = begin;
    $vertexBufferData[4] = end;
    $vertexBufferData[6] = end;
    $gl.bufferData($gl.ARRAY_BUFFER, $vertexBufferData, $gl.STATIC_DRAW);

    $gl.enableVertexAttribArray(0);
    $gl.vertexAttribPointer(0, 2, $gl.FLOAT, false, 0, 0);

    return vertexArrayObject;
};