import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import {
    $gl,
    $getUUID
} from "../../WebGLUtil";

/**
 * @description 新規のVertexArrayObjectを生成する
 *              Create a new VertexArrayObject
 *
 * @return {IVertexArrayObject}
 * @method
 * @protected
 */
export const execute = (): IVertexArrayObject =>
{
    return {
        "id": $getUUID(),
        "resource": $gl.createVertexArray() as NonNullable<WebGLVertexArrayObject>,
        "vertexBuffer": $gl.createBuffer() as NonNullable<WebGLBuffer>,
        "vertexLength": 0
    };
};