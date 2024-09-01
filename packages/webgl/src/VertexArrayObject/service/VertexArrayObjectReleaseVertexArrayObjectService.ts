import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import type { IIndexRange } from "../../interface/IIndexRange";
import { $objectPool as $meshObjectPool } from "../../Mesh";
import { $objectPool } from "../../VertexArrayObject";
import { $poolArray } from "../../WebGLUtil";

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

    // object pool
    const indexRanges = vertex_array_object.indexRanges as IIndexRange[];
    for (let idx = 0; idx < indexRanges.length; ++idx) {
        $meshObjectPool.push(indexRanges[idx]);
    }
    $poolArray(indexRanges);

    // dispose
    vertex_array_object.indexRanges = null;

    $objectPool.push(vertex_array_object);
};