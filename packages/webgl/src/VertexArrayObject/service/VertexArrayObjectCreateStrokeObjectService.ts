import type { IStrokeVertexArrayObject } from "../../interface/IStrokeVertexArrayObject";
import { $gl } from "../../WebGLUtil";
import { $getId } from "../../VertexArrayObject";

/**
 * @description ストローク用の新規のVertexArrayObjectを生成する
 *              Create a new VertexArrayObject for strokes
 *
 * @return {IStrokeVertexArrayObject}
 * @method
 * @protected
 */
export const execute = (): IStrokeVertexArrayObject =>
{
    return {
        "id": $getId(),
        "resource": $gl.createVertexArray() as NonNullable<WebGLVertexArrayObject>,
        "indexRanges": [],
        "vertexBuffer": $gl.createBuffer() as NonNullable<WebGLBuffer>,
        "vertexLength": 0,
        "indexBuffer": $gl.createBuffer() as NonNullable<WebGLBuffer>,
        "indexLength": 0,
        "indexCount": 0
    };
};