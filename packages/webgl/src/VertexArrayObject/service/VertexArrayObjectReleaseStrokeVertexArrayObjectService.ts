import type { IStrokeVertexArrayObject } from "../../interface/IStrokeVertexArrayObject";
import { $strokeObjectPool } from "../../VertexArrayObject";

/**
 * @description ストローク用のVertexArrayObjectを再利用ようにプールに追加
 *              Add a VertexArrayObject for strokes to the pool for reuse
 *
 * @param  {IStrokeVertexArrayObject} vertex_array_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (vertex_array_object: IStrokeVertexArrayObject): void =>
{
    if ($strokeObjectPool.indexOf(vertex_array_object) > -1) {
        return ;
    }
    $strokeObjectPool.push(vertex_array_object);
};