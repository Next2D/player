import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { execute as vertexArrayObjectCreateFillObjectService } from "../service/VertexArrayObjectCreateFillObjectService";
import { execute as vertexArrayObjectBindService } from "../service/VertexArrayObjectBindService";
import { $gl } from "../../WebGLUtil";

/**
 * @description 矩形描画用のVertexArrayObjectを生成します。
 *              Generates a VertexArrayObject for rectangle drawing.
 *
 * @return {IVertexArrayObject}
 * @method
 * @protected
 */
export const execute = (): IVertexArrayObject =>
{
    const vertexArrayObject = vertexArrayObjectCreateFillObjectService();
    vertexArrayObjectBindService(vertexArrayObject);

    $gl.bindBuffer($gl.ARRAY_BUFFER, vertexArrayObject.vertexBuffer);

    const vertexBufferData = new Float32Array([
        0, 0, 1, 0, 0, 1,
        1, 1, 0, 1, 1, 0
    ]);
    $gl.bufferData($gl.ARRAY_BUFFER, vertexBufferData, $gl.STATIC_DRAW);

    $gl.enableVertexAttribArray(0);
    $gl.vertexAttribPointer(0, 2, $gl.FLOAT, false, 0, 0);

    return vertexArrayObject;
};