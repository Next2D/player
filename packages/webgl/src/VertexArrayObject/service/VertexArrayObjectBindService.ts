import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { $gl } from "../../WebGLUtil";

/**
 * @description 現在バインドされているVertexArrayObject
 *              VertexArrayObject currently bound
 * 
 * @type {IVertexArrayObject}
 * @private
 */
let $boundsVertexArrayObject: IVertexArrayObject;

/**
 * @description 指定のVertexArrayObjectのresourceをバインドする
 *              Bind the resource of the specified VertexArrayObject
 * 
 * @param  {IVertexArrayObject} vertex_array_object 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (vertex_array_object: IVertexArrayObject): void =>
{
    if ($boundsVertexArrayObject
        && $boundsVertexArrayObject.id === vertex_array_object.id
    ) {
        return ;
    }

    $boundsVertexArrayObject = vertex_array_object;
    $gl.bindVertexArray(vertex_array_object.resource);
};