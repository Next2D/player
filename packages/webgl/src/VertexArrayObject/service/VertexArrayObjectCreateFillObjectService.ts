import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { $gl } from "../../WebGLUtil";

/**
 * @type {number}
 * @private
 */
let $id: number = 0;

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
        "id": $id++,
        "resource": $gl.createVertexArray() as NonNullable<WebGLVertexArrayObject>,
        "indexRanges": [],
        "vertexBuffer": $gl.createBuffer() as NonNullable<WebGLBuffer>,
        "vertexLength": 0
    };
};