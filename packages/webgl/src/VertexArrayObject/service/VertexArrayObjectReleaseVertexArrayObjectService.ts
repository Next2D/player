import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { $objectPool } from "../../VertexArrayObject";

/**
 * @description VertexArrayObjectをオブジェクトプールに保管、サイズオーバー時は削除します。
 *              Stores the VertexArrayObject in the object pool and deletes it if it exceeds the size.
 *
 * @param  {IVertexArrayObject} vertex_array_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (vertex_array_object: IVertexArrayObject): void =>
{
    if ($objectPool.indexOf(vertex_array_object) > -1) {
        return ;
    }
    $objectPool.push(vertex_array_object);
};