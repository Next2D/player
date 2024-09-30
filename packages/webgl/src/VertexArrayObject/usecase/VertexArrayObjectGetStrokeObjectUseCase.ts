import type { IStrokeVertexArrayObject } from "../../interface/IStrokeVertexArrayObject";
import { $strokeObjectPool } from "../../VertexArrayObject";
import { $gl } from "../../WebGLUtil";
import { execute as vertexArrayObjectCreateStrokeObjectService } from "../service/VertexArrayObjectCreateStrokeObjectService";
import { execute as vertexArrayObjectBindService } from "../service/VertexArrayObjectBindService";

/**
 * @description ストローク用のVertexArrayObjectを返却
 *              Returns a VertexArrayObject for strokes
 *
 * @return {IStrokeVertexArrayObject}
 * @method
 * @protected
 */
export const execute = (): IStrokeVertexArrayObject =>
{
    if ($strokeObjectPool.length) {
        return $strokeObjectPool.pop() as NonNullable<IStrokeVertexArrayObject>;
    }

    const vertexArrayObject = vertexArrayObjectCreateStrokeObjectService();
    vertexArrayObjectBindService(vertexArrayObject);

    $gl.bindBuffer($gl.ARRAY_BUFFER, vertexArrayObject.vertexBuffer);
    $gl.bindBuffer($gl.ELEMENT_ARRAY_BUFFER, vertexArrayObject.indexBuffer);

    $gl.enableVertexAttribArray(0);
    $gl.enableVertexAttribArray(1);
    $gl.enableVertexAttribArray(2);
    $gl.enableVertexAttribArray(3);
    $gl.vertexAttribPointer(0, 2, $gl.FLOAT, false, 28, 0);
    $gl.vertexAttribPointer(1, 2, $gl.FLOAT, false, 28, 8);
    $gl.vertexAttribPointer(2, 2, $gl.FLOAT, false, 28, 16);
    $gl.vertexAttribPointer(3, 1, $gl.FLOAT, false, 28, 24);

    return vertexArrayObject;
};