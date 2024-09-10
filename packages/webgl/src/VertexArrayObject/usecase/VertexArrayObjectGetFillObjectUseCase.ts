import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { $objectPool } from "../../VertexArrayObject";
import { $gl } from "../../WebGLUtil";
import { execute as vertexArrayObjectCreateFillObjectService } from "../service/VertexArrayObjectCreateFillObjectService";
import { execute as vertexArrayObjectBindService } from "../service/VertexArrayObjectBindService";

/**
 * @description 塗り用のVertexArrayObjectを返却
 *              Returns a VertexArrayObject for filling
 *
 * @return {IVertexArrayObject}
 * @method
 * @protected
 */
export const execute = (): IVertexArrayObject =>
{
    if ($objectPool.length) {
        return $objectPool.pop() as NonNullable<IVertexArrayObject>;
    }

    const vertexArrayObject = vertexArrayObjectCreateFillObjectService();
    vertexArrayObjectBindService(vertexArrayObject);

    $gl.bindBuffer($gl.ARRAY_BUFFER, vertexArrayObject.vertexBuffer);

    $gl.enableVertexAttribArray(0);
    $gl.enableVertexAttribArray(1);
    $gl.enableVertexAttribArray(2);
    $gl.enableVertexAttribArray(3);
    $gl.enableVertexAttribArray(4);
    $gl.enableVertexAttribArray(5);
    $gl.vertexAttribPointer(0, 2, $gl.FLOAT, false, 68, 0);
    $gl.vertexAttribPointer(1, 2, $gl.FLOAT, false, 68, 8);
    $gl.vertexAttribPointer(2, 4, $gl.FLOAT, false, 68, 16);
    $gl.vertexAttribPointer(3, 3, $gl.FLOAT, false, 68, 32);
    $gl.vertexAttribPointer(4, 3, $gl.FLOAT, false, 68, 44);
    $gl.vertexAttribPointer(5, 3, $gl.FLOAT, false, 68, 56);

    return vertexArrayObject;
};